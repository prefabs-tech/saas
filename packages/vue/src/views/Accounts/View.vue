<template>
  <Page v-if="account?.id" :title="account.name" class="account-view">
    <LoadingIcon v-if="loading" />

    <TabView
      v-if="processedTabs.length > 0 && visibleTabs.length > 0"
      id="tab-view-slot"
      :tabs="processedTabs"
      :visible-tabs="visibleTabs"
      :active-key="activeTab"
      @update:active-key="activeTab = $event"
    >
      <div v-for="tab in processedTabs" :key="tab.key">
        <component :is="getComponentByTabKey(tab.key)" :account="account" />
      </div>
    </TabView>
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { TabView, LoadingIcon } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, computed, inject } from "vue";
import { useRoute } from "vue-router";

import { useTranslations } from "../../index";
import AccountDetails from "./_components/AccountDetails.vue";
import useAccountsStore from "../../stores/accounts";
import Invitations from "../Invitations/Index.vue";
import Users from "../Users/Index.vue";

import type { Account } from "../../types/account";
import type { AppConfig } from "@prefabs.tech/vue3-config";
import type { Component } from "vue";

const route = useRoute();
const messages = useTranslations();
const { t } = useI18n({ messages });
const config = useConfig() as AppConfig;
const accountsStore = useAccountsStore();
const { getAccount } = accountsStore;

const __saasAccountTabs = Symbol.for("saas.accountTabs");

const accountId = route.params.id as string;
const account = ref<Account>({} as Account);
const loading = ref(true);
const activeTab = ref("info");

const defaultTabList = [
  {
    component: AccountDetails,
    key: "info",
    label: t("account.view.info"),
  },
  {
    component: Users,
    key: "users",
    label: t("account.view.users"),
  },
  {
    component: Invitations,
    key: "invitations",
    label: t("account.view.invitations"),
  },
];

console.log("__saasAccountTabs", __saasAccountTabs);

const tabConfig = inject<(() => typeof defaultTabList) | typeof defaultTabList>(
  __saasAccountTabs,
  defaultTabList
);

console.log("tabConfig", tabConfig);

const processedTabs = computed(() => {
  const additionalTabs =
    typeof tabConfig === "function"
      ? tabConfig()
      : Array.isArray(tabConfig)
        ? tabConfig
        : [];

  console.log("additionalTabs", additionalTabs);

  return [...defaultTabList, ...additionalTabs];
});

console.log("processedTabs", processedTabs.value);

const visibleTabs = computed(() => processedTabs.value.map((tab) => tab.key));

console.log("visibleTabs", visibleTabs.value);

onMounted(async () => {
  await prepareComponent();
});

function getComponentByTabKey(tabKey: string): Component {
  return (
    processedTabs.value.find((tab) => tab.key === tabKey)?.component ||
    AccountDetails
  );
}

async function prepareComponent() {
  loading.value = true;
  try {
    account.value = await getAccount(accountId, config.apiBaseUrl);
  } finally {
    loading.value = false;
  }
}
</script>
