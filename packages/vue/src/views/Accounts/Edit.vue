<template>
  <Page :title="t('accounts.edit')">
    <AccountForm
      :account="account"
      @account:updated="onAccountUpdated"
      @cancel="onCancel"
    />
  </Page>
</template>

<script setup lang="ts">
import type { AppConfig } from "@prefabs.tech/vue3-config";

import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { Account } from "../../types/account";
import type { EventMessage, SaasEventHandlers } from "../../types/plugin";

import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";
import AccountForm from "./_components/Accountform.vue";

const route = useRoute();
const accountId = route.params.id as string;

const messages = useTranslations();
const { t } = useI18n({ messages });
const config = useConfig() as AppConfig;
const router = useRouter();

const accountsStore = useAccountsStore();
const { getAccount } = accountsStore;

const account = ref({} as Account);

const eventHandlers = inject<SaasEventHandlers>(
  Symbol.for("saas.eventHandlers"),
  { notification: undefined },
);

onMounted(async () => {
  await prepareComponent();
});

const onCancel = () => {
  router.push({ name: "accounts" });
};

function onAccountUpdated(account: Account) {
  const message: EventMessage = {
    details: {
      account: account,
    },
    message: t("accounts.messages.updated"),
    type: "success",
  };

  eventHandlers?.notification?.(message);
  router.push({ name: "accounts" });
}

async function prepareComponent() {
  const response = await getAccount(accountId, config.apiBaseUrl);
  account.value = response;
}
</script>
