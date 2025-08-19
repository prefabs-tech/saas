<template>
  <div class="invitation-form">
    <Form @submit="onSubmit">
      <Input
        v-model="formData.email"
        :label="t('account.invitations.form.email.label')"
        :placeholder="t('account.invitations.form.email.placeholder')"
        :schema="emailSchema"
        name="email"
        type="email"
      />

      <SelectInput
        v-model="formData.role"
        name="role"
        :label="t('account.invitations.form.role.label')"
        :options="roleOptions"
        :placeholder="t('account.invitations.form.role.placeholder')"
        :schema="roleSchema"
      />

      <FormActions
        alignment="filled"
        :cancel-label="t('account.invitations.form.actions.cancel')"
        :submit-label="t('account.invitations.form.actions.create')"
        :loading="loading"
        flow-direction="horizontal"
        @cancel="$emit('cancel')"
      />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import { Form, FormActions, Input, SelectInput } from "@prefabs.tech/vue3-form";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { computed, inject, ref } from "vue";
import { useRoute } from "vue-router";

import { SAAS_ACCOUNT_ROLES_DEFAULT } from "../../../constant";
import { useTranslations } from "../../../index";
import useInvitationStore from "../../../stores/accountInvitations";
import {
  createEmailSchema,
  createRoleSchema,
} from "../validations/invitationValidation";

import type { AccountInvitationCreateInput } from "../../../types/accountInvitation";
import type { SaasConfig } from "../../../types/config";
import type { SaasEventHandlers, EventMessage } from "../../../types/plugin";

defineProps({
  loading: Boolean,
});

const emit = defineEmits(["cancel", "success"]);

const config = useConfig();
const invitationStore = useInvitationStore();
const { addInvitation } = invitationStore;
const messages = useTranslations();
const saasConfig = inject<SaasConfig>(Symbol.for("saas.config"));
const { t } = useI18n({ messages, locale: "en" });
const route = useRoute();

const emailSchema = createEmailSchema(t);
const roleSchema = createRoleSchema(t);

const accountId = route.params.id as string;
const formData = ref<AccountInvitationCreateInput>({
  email: "",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  role: undefined as unknown as string,
});

const roles = computed(() => {
  return saasConfig?.saasAccountRoles || SAAS_ACCOUNT_ROLES_DEFAULT;
});

// Build safe options for SelectInput
const roleOptions = computed(() => {
  return (roles.value || [])
    .filter((r): r is string => typeof r === "string" && r.length > 0)
    .map((role) => ({
      label: t(`account.invitations.form.roles.${role}`),
      value: role,
    }));
});

const eventHandlers = inject<SaasEventHandlers>(
  Symbol.for("saas.eventHandlers"),
  { notification: undefined }
);

async function onSubmit() {
  try {
    await addInvitation(accountId, formData.value, config.apiBaseUrl).then(
      (response) => {
        const message: EventMessage = {
          type: "success",
          message: t("account.invitations.messages.created"),
          details: {
            invitation: response,
          },
        };

        eventHandlers?.notification?.(message);

        emit("success", response);
      }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
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
