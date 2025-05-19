<template>
  <div class="invitation-form">
    <Form @submit="onSubmit">
      <Input
        v-model="formData.email"
        :label="t('invitations.form.label.email')"
        name="email"
        type="email"
        :schema="emailSchema"
      />

      <SelectInput
        v-model="formData.role"
        :options="roles"
        label="Role"
        placeholder="Select a role"
        :schema="roleSchema"
      />

      <FormActions
        alignment="filled"
        :cancel-label="t('invitations.form.actions.cancel')"
        :submit-label="t('invitations.form.actions.create')"
        :loading="loading"
        flow-direction="horizontal"
        @cancel="$emit('cancel')"
      />
    </Form>
  </div>
</template>

<script setup lang="ts">
// import { useConfig } from "@dzangolab/vue3-config";
import { Form, FormActions, Input } from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { ref, inject } from "vue";
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

const emailSchema = z.string().email(t("invitations.form.validation.email"));
const roleSchema = z.string().min(1, t("invitations.form.validation.role"));

const roles = [
  { value: "admin", label: t("invitations.form.roles.admin") },
  { value: "user", label: t("invitations.form.roles.user") },
];

const formData = ref<AccountInvitationCreateInput>({
  email: "",
  role: "user",
  accountId: "", // This should be set from the current account context
  invitedById: "", // This should be set from the current user context
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
