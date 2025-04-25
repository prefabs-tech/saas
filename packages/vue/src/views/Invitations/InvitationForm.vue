<template>
  <div class="invitation-form">
    <Form @submit="$emit('submit', formData)">
      <Input
        v-model="formData.email"
        :disabled="!!invitation"
        :label="t('invitations.form.label.email')"
        :schema="emailSchema"
        name="email"
        type="email"
      />
      <SelectInput
        v-model="formData.role"
        :label="t('invitations.form.label.role')"
        :options="roleOptions"
        :placeholder="t('invitations.form.placeholder.role')"
        :schema="roleSchema"
        name="role"
      />
      <FormActions
        alignment="filled"
        :cancel-label="t('invitations.form.actions.cancel')"
        :submit-label="
          !!invitation
            ? t('invitations.form.actions.update')
            : t('invitations.form.actions.create')
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
  name: "InvitationForm",
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

import type { Invitation, Role } from "../../types";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { SelectOption } from "@dzangolab/vue3-form";
import type { PropType } from "vue";

const props = defineProps({
  loading: Boolean,
  invitation: {
    default: undefined,
    type: Object as PropType<Invitation>,
  },
});

defineEmits(["cancel", "submit"]);

const config = useConfig() as AppConfig;

const rolesStore = useRolesStore();
const { getRoles } = rolesStore;

const messages = useTranslations();
const { t } = useI18n({ messages });

const formData = ref<Partial<Invitation>>({} as Partial<Invitation>);
const roleOptions = ref<SelectOption[]>([]);

const emailSchema = z
  .string()
  .email({ message: t("invitations.form.messages.invalidEmail") })
  .nonempty({
    message: t("invitations.form.messages.invalidEmail"),
  });

const roleSchema = z.string().nonempty({
  message: t("invitations.form.messages.invalidRole"),
});

watch(
  () => props.invitation,
  () => {
    formData.value =
      props.invitation ||
      ({
        email: "",
        role: "",
        payload: {},
      } as Partial<Invitation>);
  },
);

const prepareComponent = async () => {
  formData.value =
    props.invitation ||
    ({
      email: "",
      role: "",
      payload: {},
    } as Partial<Invitation>);

  const response = await getRoles(config?.apiBaseUrl);
  roleOptions.value = response?.roles?.map((role: Role) => ({
    label: role.role,
    value: role.role,
  }));
};

prepareComponent();
</script>

<style lang="css">
.invitation-form button {
  width: 100%;
}

.invitation-form .form-actions.direction-vertical {
  flex-direction: column-reverse;
}
</style>
