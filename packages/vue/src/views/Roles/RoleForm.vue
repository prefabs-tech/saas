<template>
  <div class="role-form">
    <Form @submit="$emit('submit', formData)">
      <Input
        v-model="formData.role"
        :disabled="!!role"
        :label="t('roles.form.label.role')"
        :schema="roleSchema"
        name="role"
        type="text"
      />
      <SelectInput
        v-model="formData.permissions"
        :label="t('roles.form.label.permissions')"
        :options="permissionOptions"
        :placeholder="t('roles.form.placeholder.permissions')"
        :schema="permissionsSchema"
        multiple
        name="permissions"
      />
      <FormActions
        alignment="filled"
        :cancel-label="t('roles.form.actions.cancel')"
        :submit-label="
          !!role
            ? t('roles.form.actions.update')
            : t('roles.form.actions.create')
        "
        :loading="loading"
        flow-direction="vertical"
        @cancel="$emit('cancel')"
      />
    </Form>
  </div>
</template>
<script lang="ts">
export default {
  name: "RoleForm",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { Form, FormActions, Input, SelectInput } from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { ref, watch } from "vue";
import { z } from "zod";

import { useTranslations } from "../../index";
import useRolesStore from "../../stores/roles";

import type { Role } from "../../types";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { SelectOption } from "@dzangolab/vue3-form";
import type { PropType } from "vue";

const props = defineProps({
  loading: Boolean,
  role: {
    default: undefined,
    type: Object as PropType<Role>,
  },
});

defineEmits(["cancel", "submit"]);

const config = useConfig() as AppConfig;

const rolesStore = useRolesStore();
const { getPermissions } = rolesStore;

const messages = useTranslations();

const { t } = useI18n({ messages });

const formData = ref<Role>({} as Role);
const permissionOptions = ref<SelectOption[]>([]);

const permissionsSchema = z
  .array(z.string().nullable())
  .refine((permission) => permission != null)
  .optional();
const roleSchema = z
  .string()
  .max(255, { message: t("roles.form.messages.invalidRole") })
  .nonempty({
    message: t("roles.form.messages.invalidRole"),
  });

watch(
  () => props.role,
  () => {
    formData.value =
      props.role ||
      ({
        role: "",
        permissions: [] as string[],
      } as Role);
  },
);

const prepareComponent = async () => {
  formData.value =
    props.role ||
    ({
      role: "",
      permissions: [] as string[],
    } as Role);

  const response = await getPermissions(config?.apiBaseUrl);
  permissionOptions.value = response?.data?.permissions?.map(
    (permission: string) => ({
      label: permission,
      value: permission,
    }),
  );
};

prepareComponent();
</script>

<style lang="css">
.role-form button {
  width: 100%;
}

.role-form .form-actions.direction-vertical {
  flex-direction: column-reverse;
}
</style>
