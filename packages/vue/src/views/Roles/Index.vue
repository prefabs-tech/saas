<template>
  <Page :title="t('roles.title')">
    <template #toolbar>
      <ButtonElement
        :label="t('roles.table.actions.addRole')"
        icon-left="pi pi-plus"
        @click="onCreateRole"
      />
    </template>
    <Table
      id="roles-table"
      :columns-data="columns"
      :data="rolesData"
      :data-action-menu="actionMenuData"
      :empty-table-message="t('roles.table.emptyMessage')"
      :paginated="false"
      class="table-roles"
      :is-loading="isLoading"
      is-server-table
      @action:select="onActionSelect"
    />
    <Modal :show="showModal" class="role-modal" @on:close="showModal = false">
      <template #header>{{
        !!role ? t("roles.form.label.update") : t("roles.form.label.add")
      }}</template>

      <RoleForm
        :loading="loading"
        :role="role"
        @cancel="onCancel"
        @submit="onSubmit"
      />
    </Modal>
  </Page>
</template>

<script lang="ts">
export default {
  name: "RolesTable",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Table } from "@dzangolab/vue3-tanstack-table";
import { BadgeComponent, ButtonElement, Modal } from "@dzangolab/vue3-ui";
import { h, ref } from "vue";

import RoleForm from "./RoleForm.vue";
import { ERROR_ROLE_ALREADY_EXISTS } from "../../constant";
import { emitter, useTranslations } from "../../index";
import useRolesStore from "../../stores/roles";

import type { Role } from "../../types";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { TableColumnDefinition } from "@dzangolab/vue3-tanstack-table";

const config = useConfig() as AppConfig;

const messages = useTranslations();
const { t } = useI18n({ messages });

defineProps({
  isLoading: Boolean,
});

const rolesStore = useRolesStore();
const { createRole, deleteRole, getRoles, updateRolePermissions } = rolesStore;

const loading = ref<boolean>(false);
const role = ref<Role>();
const rolesData = ref<Role[]>([]);
const showModal = ref<boolean>(false);

const actionMenuData = [
  {
    key: "editRole",
    label: t("roles.table.actions.updatePermissions"),
  },
  {
    class: "danger",
    confirmationOptions: {
      body: t("roles.table.confirmation.deleteRole.message"),
      header: t("roles.table.confirmation.deleteRole.header"),
    },
    key: "deleteRole",
    label: t("roles.table.actions.deleteRole"),
    requireConfirmationModal: true,
  },
];

const columns: TableColumnDefinition<Role>[] = [
  {
    accessorKey: "role",
    header: t("roles.table.columns.roles"),
  },
  {
    accessorKey: "permissions",
    header: t("roles.table.columns.permissions"),
    cell: ({ getValue }) => {
      const permissionData = getValue() as string[];

      return permissionData?.sort().map((permission, index) => {
        return h(BadgeComponent, {
          key: permission + "-" + index,
          label: permission,
          severity: "success",
          style: {
            marginTop: "0.1rem",
            marginBottom: "0.1rem",
            marginRight: "1rem",
          },
        });
      });
    },
  },
];

const onActionSelect = (rowData: { action: string; data: Role }) => {
  switch (rowData.action) {
    case "editRole":
      onEditRole(rowData.data);
      break;
    case "deleteRole":
      onDeleteRole(rowData.data);
      break;
  }
};

const onCancel = () => {
  showModal.value = false;
  role.value = undefined;
};

const onCreateRole = () => {
  showModal.value = true;
  role.value = undefined;
};

const onDeleteRole = async (roleData: Role) => {
  await deleteRole(roleData?.role, config?.apiBaseUrl)
    .then(() => {
      prepareComponent();

      emitter.emit("notify", {
        title: t("roles.table.messages.delete.success"),
        type: "success",
      });
    })
    .catch(() => {
      emitter.emit("notify", {
        title: t("roles.table.messages.delete.error"),
        type: "error",
      });
    });
};

const onEditRole = (roleData: Role) => {
  showModal.value = true;
  role.value = roleData;
};

const onSubmit = async (roleData: Role) => {
  loading.value = true;

  try {
    if (role.value) {
      await updateRolePermissions(roleData, config?.apiBaseUrl).then(() => {
        prepareComponent();
        emitter.emit("notify", {
          title: t("roles.form.messages.update.success"),
          type: "success",
        });
      });
    } else {
      await createRole(roleData, config?.apiBaseUrl).then(() => {
        role.value = undefined;
        prepareComponent();
        emitter.emit("notify", {
          title: t("roles.form.messages.add.success"),
          type: "success",
        });
      });
    }
    //eslint-disable-next-line
  } catch (error: any) {
    if (
      !role.value &&
      error?.response?.data?.name === ERROR_ROLE_ALREADY_EXISTS
    ) {
      emitter.emit("notify", {
        title: t("roles.form.messages.add.roleAlreadyExists"),
        type: "error",
      });
    } else {
      emitter.emit("notify", {
        title: t(
          role.value
            ? "roles.form.messages.update.error"
            : "roles.form.messages.add.error",
        ),
        type: "error",
      });
    }
  } finally {
    loading.value = false;
    showModal.value = false;
  }
};

const prepareComponent = async () => {
  //eslint-disable-next-line
  await getRoles(config?.apiBaseUrl).then((response: any) => {
    rolesData.value = response?.roles || [];
  });
};

prepareComponent();
</script>

<style lang="css">
@import "../../assets/css/roles-table.css";
</style>
