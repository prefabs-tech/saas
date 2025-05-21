<template>
  <Table
    id="invitations-table"
    :columns-data="columns"
    :data="invitations"
    :data-action-menu="actionMenuData"
    :empty-table-message="t('customer.invitations.table.emptyMessage')"
    :is-loading="isLoading"
    class="table-invitations"
    @action:select="onActionSelect"
  >
    <template #toolbar>
      <ButtonElement
        :label="t('customer.invitations.table.actions.addInvitation')"
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
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Table } from "@dzangolab/vue3-tanstack-table";
import { BadgeComponent, ButtonElement } from "@dzangolab/vue3-ui";
import { ref, onMounted, h } from "vue";
import { useRoute } from "vue-router";

import InvitationModal from "./_components/InvitationModal.vue";
import { useTranslations } from "../../index";
import useInvitationStore from "../../stores/invitation";

import type { AccountInvitation } from "../../types/accountInvitation";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { TableColumnDefinition } from "@dzangolab/vue3-tanstack-table";

// Props
defineProps({
  isLoading: Boolean,
});

// Emits
const emit = defineEmits([
  "invitation:deleted",
  "invitation:resent",
  "invitation:revoked",
]);

// Composables
const config = useConfig() as AppConfig;
const messages = useTranslations();
const { t } = useI18n({ messages });
const invitationStore = useInvitationStore();
const { deleteInvitation, getInvitations, resendInvitation, revokeInvitation } =
  invitationStore;
const route = useRoute();

// Constants
const accountId = route.params.id as string;

const actionMenuData = [
  {
    key: "resendInvitation",
    label: t("customer.invitations.table.actions.resendInvitation"),
    show: (row: AccountInvitation) => !row.acceptedAt && !row.revokedAt,
  },
  {
    key: "revokeInvitation",
    label: t("customer.invitations.table.actions.revokeInvitation"),
    show: (row: AccountInvitation) => !row.acceptedAt && !row.revokedAt,
  },
  {
    class: "danger",
    confirmationOptions: {
      body: t(
        "customer.invitations.table.confirmation.deleteInvitation.message"
      ),
      header: t(
        "customer.invitations.table.confirmation.deleteInvitation.header"
      ),
    },
    key: "deleteInvitation",
    label: t("customer.invitations.table.actions.deleteInvitation"),
    requireConfirmationModal: true,
  },
];

const columns: TableColumnDefinition<AccountInvitation>[] = [
  {
    accessorKey: "email",
    enableColumnFilter: true,
    enableSorting: true,
    filterPlaceholder: t("customer.invitations.table.filter.email"),
    header: t("customer.invitations.table.columns.email"),
  },
  {
    accessorKey: "role",
    header: t("customer.invitations.table.columns.role"),
    cell: ({ row: { original } }) =>
      h(BadgeComponent, {
        label: original.role,
        severity: original.role === "admin" ? "primary" : "success",
      }),
  },
  {
    accessorKey: "status",
    header: t("customer.invitations.table.columns.status"),
    cell: ({ row: { original } }) =>
      h(BadgeComponent, {
        label: original.acceptedAt
          ? t("customer.invitations.table.status.accepted")
          : original.revokedAt
            ? t("customer.invitations.table.status.revoked")
            : t("customer.invitations.table.status.pending"),
        severity: original.acceptedAt
          ? "success"
          : original.revokedAt
            ? "danger"
            : "warning",
      }),
  },
  {
    accessorKey: "expiresAt",
    header: t("customer.invitations.table.columns.expiresAt"),
    cell: ({ row: { original } }) =>
      new Date(original.expiresAt).toLocaleDateString(),
  },
  {
    accessorKey: "createdAt",
    header: t("customer.invitations.table.columns.createdAt"),
    cell: ({ row: { original } }) =>
      new Date(original.createdAt).toLocaleDateString(),
  },
];

// State
const invitations = ref<AccountInvitation[]>([]);
const showInvitationModal = ref(false);

// Lifecycle Hooks
onMounted(async () => {
  await fetchInvitations();
});

// Methods
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
    emit("invitation:deleted", invitation);
  } catch (error) {
    console.error("Failed to delete invitation:", error);
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
  } catch (error) {
    console.error("Failed to resend invitation:", error);
  }
}

async function handleRevoke(invitation: AccountInvitation) {
  try {
    await revokeInvitation(accountId, invitation.id, config.apiBaseUrl);
    await fetchInvitations();
    emit("invitation:revoked", invitation);
  } catch (error) {
    console.error("Failed to revoke invitation:", error);
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
