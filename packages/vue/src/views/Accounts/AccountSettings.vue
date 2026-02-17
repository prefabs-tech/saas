<template>
  <Page
    v-if="activeAccount?.id"
    :loading="loading"
    :title="activeAccount?.name"
    class="account-show account-settings"
  >
    <TabView
      v-if="processedTabs.length > 0 && visibleTabs.length > 0"
      id="account-settings-tabs"
      :tabs="processedTabs"
      :visible-tabs="visibleTabs"
      :active-key="activeTab"
      @update:active-key="activeTab = $event"
    >
      <div v-for="tab in processedTabs" :key="tab.key">
        <component
          :is="getComponentByTabKey(tab.key)"
          :account="activeAccount"
        />
      </div>
    </TabView>
    <template #titleTag>
      <BadgeComponent
        :label="
          t(
            `account.type.${activeAccount?.individual ? 'individual' : 'organization'}.label`,
          )
        "
        :severity="activeAccount?.individual ? 'primary' : 'success'"
      />
    </template>
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page, BadgeComponent, TabView } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, computed, inject } from "vue";

import { useTranslations } from "../../index";
import AccountDetails from "./_components/AccountDetails.vue";
import { useGlobalAccountError } from "../../composables/UseGlobalAccountError";
import { useMyAccountsStore } from "../../stores/MyAccounts";
import Invitations from "../Invitations/Index.vue";
import Users from "../Users/Index.vue";

import type { Component } from "vue";

const messages = useTranslations();
const { t } = useI18n({ messages });
const myAccountsStore = useMyAccountsStore();
const { checkForAccountError } = useGlobalAccountError();

const __saasAccountTabs = Symbol.for("saas.accountTabs");

const activeAccount = computed(() => myAccountsStore.activeAccount);
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

const tabConfig = inject<(() => typeof defaultTabList) | typeof defaultTabList>(
  __saasAccountTabs,
  defaultTabList,
);

const processedTabs = computed(() => {
  const additionalTabs =
    typeof tabConfig === "function"
      ? tabConfig()
      : Array.isArray(tabConfig)
        ? tabConfig
        : [];

  const result = [...defaultTabList, ...additionalTabs];

  return result;
});

const visibleTabs = computed(() => processedTabs.value.map((tab) => tab.key));

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
    if (!activeAccount.value) {
      await myAccountsStore.fetchMyAccount();
    }
  } catch (error) {
    if (checkForAccountError(error)) {
      return;
    }
    // eslint-disable-next-line no-console
    console.error("Failed to fetch account:", error);
  } finally {
    loading.value = false;
  }
}
</script>
