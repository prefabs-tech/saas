<template>
  <Page :title="t('accounts.add')">
    <AccountForm @account:created="onAccountCreated" @cancel="onCancel" />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { inject } from "vue";
import { useRouter } from "vue-router";

import type { Account } from "../../types/account";
import type { EventMessage, SaasEventHandlers } from "../../types/plugin";

import { useTranslations } from "../../index";
import AccountForm from "./_components/Accountform.vue";

const messages = useTranslations();
const { t } = useI18n({ messages });
const router = useRouter();

const eventHandlers = inject<SaasEventHandlers>(
  Symbol.for("saas.eventHandlers"),
  { notification: undefined },
);

function onAccountCreated(account: Account) {
  const message: EventMessage = {
    details: {
      account: account,
    },
    message: t("accounts.messages.created"),
    type: "success",
  };

  eventHandlers?.notification?.(message);
  router.push({ name: "accounts" });
}

function onCancel() {
  router.push({ name: "accounts" });
}
</script>
