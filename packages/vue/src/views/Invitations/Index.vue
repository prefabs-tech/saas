<template>
  <Page :title="t('invitations.title')">
    <template #toolbar>
      <ButtonElement
        :label="t('invitations.table.actions.addInvitation')"
        icon-left="pi pi-plus"
        @click="onCreateInvitation"
      />
    </template>
    <Table
      id="invitations-table"
      :columns-data="columns"
      :data="invitationsData"
      :data-action-menu="actionMenuData"
      :empty-table-message="t('invitations.table.emptyMessage')"
      :paginated="false"
      class="table-invitations"
      :is-loading="isLoading"
      is-server-table
      @action:select="onActionSelect"
    />
    <Modal
      :show="showModal"
      class="invitation-modal"
      @on:close="showModal = false"
    >
      <template #header>{{
        !!invitation
          ? t("invitations.form.label.update")
          : t("invitations.form.label.add")
      }}</template>

      <InvitationForm
        :loading="loading"
        :invitation="invitation"
        @cancel="onCancel"
        @submit="onSubmit"
      />
    </Modal>
  </Page>
</template>

<script lang="ts">
export default {
  name: "InvitationsTable",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Table } from "@dzangolab/vue3-tanstack-table";
import { BadgeComponent, ButtonElement, Modal } from "@dzangolab/vue3-ui";
import { h, ref } from "vue";

import InvitationForm from "./InvitationForm.vue";
import { emitter, useTranslations } from "../../index";
import { useInvitationsStore } from "../../stores/invitations";

import type { Invitation } from "../../types";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { TableColumnDefinition } from "@dzangolab/vue3-tanstack-table";

const config = useConfig() as AppConfig;

const messages = useTranslations();
const { t } = useI18n({ messages });

defineProps({
  isLoading: Boolean,
});

const invitationsStore = useInvitationsStore();
const { createInvitation, deleteInvitation, getAllInvitations } =
  invitationsStore;

const loading = ref<boolean>(false);
const invitation = ref<Invitation>();
const invitationsData = ref<Invitation[]>([]);
const showModal = ref<boolean>(false);

const actionMenuData = [
  {
    key: "editInvitation",
    label: t("invitations.table.actions.updateInvitation"),
  },
  {
    class: "danger",
    confirmationOptions: {
      body: t("invitations.table.confirmation.deleteInvitation.message"),
      header: t("invitations.table.confirmation.deleteInvitation.header"),
    },
    key: "deleteInvitation",
    label: t("invitations.table.actions.deleteInvitation"),
    requireConfirmationModal: true,
  },
];

const columns: TableColumnDefinition<Invitation>[] = [
  {
    accessorKey: "email",
    header: t("invitations.table.columns.email"),
  },
  {
    accessorKey: "role",
    header: t("invitations.table.columns.role"),
  },
  {
    accessorKey: "status",
    header: t("invitations.table.columns.status"),
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return h(BadgeComponent, {
        label: status,
        severity: status === "active" ? "success" : "warning",
      });
    },
  },
  {
    accessorKey: "expiresAt",
    header: t("invitations.table.columns.expiresAt"),
    cell: ({ getValue }) => {
      const date = getValue() as number;
      return new Date(date).toLocaleDateString();
    },
  },
];

const onActionSelect = (rowData: { action: string; data: Invitation }) => {
  switch (rowData.action) {
    case "editInvitation":
      onEditInvitation(rowData.data);
      break;
    case "deleteInvitation":
      onDeleteInvitation(rowData.data);
      break;
  }
};

const onCancel = () => {
  showModal.value = false;
  invitation.value = undefined;
};

const onCreateInvitation = () => {
  showModal.value = true;
  invitation.value = undefined;
};

const onDeleteInvitation = async (invitationData: Invitation) => {
  await deleteInvitation(invitationData?.id, config?.apiBaseUrl)
    .then(() => {
      prepareComponent();
      emitter.emit("notify", {
        title: t("invitations.table.messages.delete.success"),
        type: "success",
      });
    })
    .catch(() => {
      emitter.emit("notify", {
        title: t("invitations.table.messages.delete.error"),
        type: "error",
      });
    });
};

const onEditInvitation = (invitationData: Invitation) => {
  showModal.value = true;
  invitation.value = invitationData;
};

const onSubmit = async (invitationData: Invitation) => {
  loading.value = true;

  try {
    if (invitation.value) {
      // TODO: Add update invitation functionality when available
      emitter.emit("notify", {
        title: t("invitations.form.messages.update.success"),
        type: "success",
      });
    } else {
      await createInvitation(invitationData, config?.apiBaseUrl).then(() => {
        invitation.value = undefined;
        prepareComponent();
        emitter.emit("notify", {
          title: t("invitations.form.messages.add.success"),
          type: "success",
        });
      });
    }
  } catch (error) {
    emitter.emit("notify", {
      title: t(
        invitation.value
          ? "invitations.form.messages.update.error"
          : "invitations.form.messages.add.error",
      ),
      type: "error",
    });
  } finally {
    loading.value = false;
    showModal.value = false;
  }
};

const prepareComponent = async () => {
  const response = await getAllInvitations(config?.apiBaseUrl);
  invitationsData.value = response || [];
};

prepareComponent();
</script>

<style lang="css">
@import "../../assets/css/invitations-table.css";
</style>
