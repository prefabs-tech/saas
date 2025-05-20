<template>
  <div class="invitation-form">
    <Form @submit="onSubmit">
      <Input
        v-model="formData.email"
        :label="t('customers.invitations.form.label.email')"
        name="email"
        type="email"
        :schema="emailSchema"
      />

      <SelectInput
        v-model="formData.role"
        :options="roles"
        :label="t('customers.invitations.form.label.role')"
        :placeholder="t('customers.invitations.form.placeholder.role')"
        :schema="roleSchema"
      />

      <FormActions
        alignment="filled"
        :cancel-label="t('customers.invitations.form.actions.cancel')"
        :submit-label="t('customers.invitations.form.actions.create')"
        :loading="loading"
        flow-direction="horizontal"
        @cancel="$emit('cancel')"
      />
    </Form>
  </div>
</template>

<script setup lang="ts">
// import { useConfig } from "@dzangolab/vue3-config";
import { Form, FormActions, Input, SelectInput } from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import * as z from "zod";

import { useTranslations } from "../../../index";

import type { AccountInvitationCreateInput } from "../../../types/accountInvitation";
import type { SaasConfig } from "../../../types/config";

defineProps({
  loading: Boolean,
});

const emit = defineEmits(["cancel", "submit"]);

// const config = useConfig();
const messages = useTranslations();
const saasConfig = inject<SaasConfig>(Symbol.for("saas.config"));
const { t } = useI18n({ messages, locale: "en" });

if (!saasConfig) {
  throw new Error("SAAS config not provided");
}

const emailSchema = z
  .string()
  .email(t("customers.invitations.form.validation.email"));
const roleSchema = z
  .string()
  .min(1, t("customers.invitations.form.validation.role"));

const roles = [
  {
    label: t("customers.invitations.form.roles.admin"),
    value: "admin",
  },
  {
    label: t("customers.invitations.form.roles.user"),
    value: "user",
  },
];

const route = useRoute();
const accountId = route.params.id as string;

const formData = ref<AccountInvitationCreateInput>({
  email: "",
  role: "user",
  accountId: accountId,
  invitedById: "",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
});

const onSubmit = async () => {
  try {
    emit("submit", formData.value);
  } catch (error) {
    console.error("Form submission error:", error);
  }
};
</script>

<style lang="css">
.invitation-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invitation-form .form-actions {
  margin-top: 1rem;
}

.invitation-form .form-actions.direction-horizontal {
  flex-direction: row-reverse;
}
</style>
