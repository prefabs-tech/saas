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
    @created="handleInvitationCreated"
  />
</template>

<script setup lang="ts">
// Imports
import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Table } from "@prefabs.tech/vue3-tanstack-table";
import { BadgeComponent, ButtonElement } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, h, inject } from "vue";
import { useRoute } from "vue-router";

import InvitationModal from "./_components/InvitationModal.vue";
import { useTranslations } from "../../index";
import useInvitationStore from "../../stores/accountInvitations";

import type { AccountInvitation } from "../../types/accountInvitation";
import type { SaasEventHandlers } from "../../types/plugin";
import type { AppConfig } from "@prefabs.tech/vue3-config";
import type { TableColumnDefinition } from "@prefabs.tech/vue3-tanstack-table";

defineProps({
  isLoading: Boolean,
});

const emit = defineEmits([
  "invitation:deleted",
  "invitation:resent",
  "invitation:revoked",
]);

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

const actionMenuData = [
  {
    confirmationOptions: {
      body: t(
        "account.invitations.table.confirmation.resendInvitation.message"
      ),
      header: t(
        "account.invitations.table.confirmation.resendInvitation.header"
      ),
    },
    key: "resendInvitation",
    label: t("account.invitations.table.actions.resendInvitation"),
    requireConfirmationModal: true,
    show: (row: AccountInvitation) => !row.acceptedAt && !row.revokedAt,
  },
  {
    class: "warning",
    confirmationOptions: {
      body: t(
        "account.invitations.table.confirmation.revokeInvitation.message"
      ),
      header: t(
        "account.invitations.table.confirmation.revokeInvitation.header"
      ),
    },
    key: "revokeInvitation",
    label: t("account.invitations.table.actions.revokeInvitation"),
    requireConfirmationModal: true,
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
    header: t("account.invitations.table.columns.role"),
    cell: ({ row: { original } }) =>
      h(BadgeComponent, {
        label: t(`account.invitations.table.roles.${original.role}`),
        severity: original.role === "admin" ? "primary" : "success",
      }),
  },
  {
    accessorKey: "status",
    header: t("account.invitations.table.columns.status"),
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
  },
  {
    accessorKey: "expiresAt",
    header: t("account.invitations.table.columns.expiresAt"),
    cell: ({ row: { original } }) =>
      new Date(original.expiresAt).toLocaleDateString(),
  },
  {
    accessorKey: "createdAt",
    header: t("account.invitations.table.columns.createdAt"),
    cell: ({ row: { original } }) =>
      new Date(original.createdAt).toLocaleDateString(),
  },
];

const invitations = ref<AccountInvitation[]>([]);
const showInvitationModal = ref(false);

onMounted(async () => {
  await fetchInvitations();
});

async function fetchInvitations() {
  try {
    const response = await getInvitations(accountId, config.apiBaseUrl);
    invitations.value = response;
  } catch {
    // Error is handled by the component's error state
  }
}

async function handleDelete(invitation: AccountInvitation) {
  try {
    await deleteInvitation(accountId, invitation.id, config.apiBaseUrl);
    await fetchInvitations();
    emit("invitation:deleted", invitation);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "success",
        message: t("account.invitations.messages.deleted"),
      });
    }
  } catch {
    // Error is handled by the component's error state
    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "error",
        message: t("account.invitations.messages.deleteError"),
      });
    }
  }
}

const handleInvitationCreated = async () => {
  showInvitationModal.value = false;
  await fetchInvitations();
};

async function handleResend(invitation: AccountInvitation) {
  try {
    await resendInvitation(accountId, invitation.id, config.apiBaseUrl);
    await fetchInvitations();
    emit("invitation:resent", invitation);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "success",
        message: t("account.invitations.messages.resent"),
      });
    }
  } catch {
    // Error is handled by the component's error state
    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "error",
        message: t("account.invitations.messages.resendError"),
      });
    }
  }
}

async function handleRevoke(invitation: AccountInvitation) {
  try {
    await revokeInvitation(accountId, invitation.id, config.apiBaseUrl);
    await fetchInvitations();
    emit("invitation:revoked", invitation);

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "success",
        message: t("account.invitations.messages.revoked"),
      });
    }
  } catch {
    // Error is handled by the component's error state
    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "error",
        message: t("account.invitations.messages.revokeError"),
      });
    }
  }
}

function onActionSelect(rowData: { action: string; data: AccountInvitation }) {
  switch (rowData.action) {
    case "resendInvitation":
      handleResend(rowData.data);
      break;
    case "revokeInvitation":
      handleRevoke(rowData.data);
      break;
    case "deleteInvitation":
      handleDelete(rowData.data);
      break;
  }
}
</script>
