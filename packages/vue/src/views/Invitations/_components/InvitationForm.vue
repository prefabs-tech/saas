<template>
  <div class="invitation-form">
    <Form @submit="onSubmit">
      <Input
        v-model="formData.email"
        :label="t('customers.invitations.form.email.label')"
        :placeholder="t('customers.invitations.form.email.placeholder')"
        :schema="emailSchema"
        name="email"
        type="email"
      />

      <SelectInput
        v-model="formData.role"
        :label="t('customers.invitations.form.role.label')"
        :options="
          roles.map((role) => ({
            label: t(`customers.invitations.form.roles.${role}`),
            value: role,
          }))
        "
        :placeholder="t('customers.invitations.form.role.placeholder')"
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
import { useConfig } from "@dzangolab/vue3-config";
import { Form, FormActions, Input, SelectInput } from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { computed, inject, ref } from "vue";
import { useRoute } from "vue-router";
import * as z from "zod";

import { SAAS_ACCOUNT_ROLES_DEFAULT } from "../../../constant";
import { useTranslations } from "../../../index";
import useInvitationStore from "../../../stores/invitation";

import type { AccountInvitationCreateInput } from "../../../types/accountInvitation";
import type { SaasConfig } from "../../../types/config";

defineProps({
  loading: Boolean,
});

const emit = defineEmits(["cancel", "submit"]);

const config = useConfig();
const invitationStore = useInvitationStore();
const { addInvitation } = invitationStore;
const messages = useTranslations();
const saasConfig = inject<SaasConfig>(Symbol.for("saas.config"));
const { t } = useI18n({ messages, locale: "en" });
const route = useRoute();

const emailSchema = z
  .string()
  .email(t("customers.invitations.form.validation.email"));

const roleSchema = z
  .string()
  .min(1, t("customers.invitations.form.validation.role"));

const accountId = route.params.id as string;
const formData = ref<AccountInvitationCreateInput>({
  email: "",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  role: "",
});

const roles = computed(() => {
  return saasConfig?.saasAccountRoles || SAAS_ACCOUNT_ROLES_DEFAULT;
});

async function onSubmit() {
  try {
    await addInvitation(accountId, formData.value, config.apiBaseUrl).then(
      (response) => {
        emit("submit", response);
      }
    );
  } catch (error) {
    console.error("Form submission error:", error);
  }
}
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
