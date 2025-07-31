<template>
  <Table
    id="invitations-table"
    :columns-data="columns"
    :data="invitations"
    :data-action-menu="actionMenuData"
    :empty-table-message="t('account.invitations.table.emptyMessage')"
    :is-loading="isLoading"
    class="table-invitations"
    @action:select="onActionSelect"
  >
    <template #toolbar>
      <ButtonElement
        :label="t('account.invitations.table.actions.addInvitation')"
        icon-left="pi pi-plus"
        @click="showInvitationModal = true"
      />
    </template>
  </Table>

  <InvitationModal
    v-if="showInvitationModal"
    :show="showInvitationModal"
    @close="showInvitationModal = false"
    @invitation:created="handleInvitationCreated"
  />
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Table } from "@dzangolab/vue3-tanstack-table";
import { BadgeComponent, ButtonElement } from "@dzangolab/vue3-ui";
import { ref, onMounted, h, inject } from "vue";
import { useRoute } from "vue-router";

import InvitationModal from "./_components/InvitationModal.vue";
import { useTranslations } from "../../index";
import useInvitationStore from "../../stores/accountInvitations";

import type { AccountInvitation } from "../../types/accountInvitation";
import type { SaasEventHandlers, EventMessage } from "../../types/plugin";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { TableColumnDefinition } from "@dzangolab/vue3-tanstack-table";

defineProps({
  isLoading: Boolean,
});

const config = useConfig() as AppConfig;
const messages = useTranslations();
const { t } = useI18n({ messages });
const invitationStore = useInvitationStore();
const { deleteInvitation, getInvitations, resendInvitation, revokeInvitation } =
  invitationStore;
const route = useRoute();

const eventHandlers = inject<SaasEventHandlers>(
  Symbol.for("saas.eventHandlers"),
  { notification: undefined }
);

const accountId = route.params.id as string;
const invitations = ref<AccountInvitation[]>([]);
const showInvitationModal = ref(false);

const actionMenuData = [
  {
    key: "resendInvitation",
    label: t("account.invitations.table.actions.resendInvitation"),
    show: (row: AccountInvitation) => !row.acceptedAt && !row.revokedAt,
  },
  {
    key: "revokeInvitation",
    label: t("account.invitations.table.actions.revokeInvitation"),
    show: (row: AccountInvitation) => !row.acceptedAt && !row.revokedAt,
  },
  {
    class: "danger",
    confirmationOptions: {
      body: t(
        "account.invitations.table.confirmation.deleteInvitation.message"
      ),
      header: t(
        "account.invitations.table.confirmation.deleteInvitation.header"
      ),
    },
    key: "deleteInvitation",
    label: t("account.invitations.table.actions.deleteInvitation"),
    requireConfirmationModal: true,
  },
];

const columns: TableColumnDefinition<AccountInvitation>[] = [
  {
    accessorKey: "email",
    enableColumnFilter: true,
    enableSorting: true,
    filterPlaceholder: t("account.invitations.table.filter.email"),
    header: t("account.invitations.table.columns.email"),
  },
  {
    accessorKey: "role",
    cell: ({ row: { original } }) =>
      h(BadgeComponent, {
        label: original.role,
        severity: original.role === "admin" ? "primary" : "success",
      }),
    header: t("account.invitations.table.columns.role"),
  },
  {
    accessorKey: "status",
    cell: ({ row: { original } }) =>
      h(BadgeComponent, {
        label: original.acceptedAt
          ? t("account.invitations.table.status.accepted")
          : original.revokedAt
            ? t("account.invitations.table.status.revoked")
            : t("account.invitations.table.status.pending"),
        severity: original.acceptedAt
          ? "success"
          : original.revokedAt
            ? "danger"
            : "warning",
      }),
    header: t("account.invitations.table.columns.status"),
  },
  {
    accessorKey: "expiresAt",
    cell: ({ row: { original } }) =>
      new Date(original.expiresAt).toLocaleDateString(),
    header: t("account.invitations.table.columns.expiresAt"),
  },
  {
    accessorKey: "createdAt",
    cell: ({ row: { original } }) =>
      new Date(original.createdAt).toLocaleDateString(),
    header: t("account.invitations.table.columns.createdAt"),
  },
];

onMounted(async () => {
  await fetchInvitations();
});

async function fetchInvitations() {
  try {
    const response = await getInvitations(accountId, config.apiBaseUrl);
    invitations.value = response;
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
  }
}

async function handleDelete(invitation: AccountInvitation) {
  try {
    await deleteInvitation(accountId, invitation.id, config.apiBaseUrl);
    await fetchInvitations();

    const message: EventMessage = {
      message: t("account.invitations.messages.deleted", {
        email: invitation.email,
      }),
      type: "success",
    };

    eventHandlers?.notification?.(message);
  } catch (error) {
    console.error("Failed to delete invitation:", error);
  }
}

async function handleInvitationCreated(invitation: AccountInvitation) {
  showInvitationModal.value = false;
  await fetchInvitations();

  const message: EventMessage = {
    message: t("account.invitations.messages.created", {
      email: invitation.email,
    }),
    type: "success",
  };

  eventHandlers?.notification?.(message);
}

async function handleResend(invitation: AccountInvitation) {
  try {
    await resendInvitation(accountId, invitation.id, config.apiBaseUrl);
    await fetchInvitations();

    const message: EventMessage = {
      message: t("account.invitations.messages.resend", {
        email: invitation.email,
      }),
      type: "success",
    };

    eventHandlers?.notification?.(message);
  } catch (error) {
    console.error("Failed to resend invitation:", error);
  }
}

async function handleRevoke(invitation: AccountInvitation) {
  try {
    await revokeInvitation(accountId, invitation.id, config.apiBaseUrl);
    await fetchInvitations();

    const message: EventMessage = {
      message: t("account.invitations.messages.revoked", {
        email: invitation.email,
      }),
      type: "success",
    };

    eventHandlers?.notification?.(message);
  } catch (error) {
    console.error("Failed to revoke invitation:", error);
  }
}

function onActionSelect(rowData: { action: string; data: AccountInvitation }) {
  switch (rowData.action) {
    case "deleteInvitation":
      handleDelete(rowData.data);
      break;
    case "resendInvitation":
      handleResend(rowData.data);
      break;
    case "revokeInvitation":
      handleRevoke(rowData.data);
      break;
  }
}
</script>
