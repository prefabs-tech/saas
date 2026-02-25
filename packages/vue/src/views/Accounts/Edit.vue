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
import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { inject, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import AccountForm from "./_components/Accountform.vue";
import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";

import type { Account } from "../../types/account";
import type { SaasEventHandlers, EventMessage } from "../../types/plugin";
import type { AppConfig } from "@prefabs.tech/vue3-config";

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

async function prepareComponent() {
  const response = await getAccount(accountId, config.apiBaseUrl);
  account.value = response;
}

function onAccountUpdated(account: Account) {
  const message: EventMessage = {
    type: "success",
    message: t("accounts.messages.updated"),
    details: {
      account: account,
    },
  };

  eventHandlers?.notification?.(message);
  router.push({ name: "accounts" });
}
</script>
