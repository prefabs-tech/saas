<template>
  <Page :title="t('accounts.add')">
    <AccountForm @account:created="onAccountCreated" @cancel="onCancel" />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { inject } from "vue";
import { useRouter } from "vue-router";

import AccountForm from "./_components/Accountform.vue";
import { useTranslations } from "../../index";

import type { Account } from "../../types/account";
import type { SaasEventHandlers, EventMessage } from "../../types/plugin";

const messages = useTranslations();
const { t } = useI18n({ messages });
const router = useRouter();

const eventHandlers = inject<SaasEventHandlers>(
  Symbol.for("saas.eventHandlers"),
  { notification: undefined }
);

function onAccountCreated(account: Account) {
  const message: EventMessage = {
    type: "success",
    message: t("accounts.messages.created"),
    details: {
      account: account,
    },
  };

  eventHandlers?.notification?.(message);
  router.push({ name: "accounts" });
}

function onCancel() {
  router.push({ name: "accounts" });
}
</script>
