<template>
  <TabView
    v-if="processedTabs.length > 0 && visibleTabs.length > 0"
    :id="id"
    :tabs="processedTabs"
    :visible-tabs="visibleTabs"
    :active-key="activeTabKey"
    @update:active-key="handleTabChange"
  >
    <div v-for="tab in processedTabs" :key="tab.key">
      <component :is="getComponentByTabKey(tab.key)" :account="account" />
    </div>
  </TabView>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { TabView } from "@prefabs.tech/vue3-ui";
import { computed, inject } from "vue";

import AccountDetails from "./AccountDetails.vue";
import { useTranslations } from "../../../index";
import Invitations from "../../Invitations/Index.vue";
import Users from "../../Users/Index.vue";

import type { Account } from "../../../types/account";
import type { Component, PropType } from "vue";

export interface AccountTab {
  key: string;
  label?: string;
  component?: Component;
  display?: boolean;
}

const props = defineProps({
  account: {
    required: true,
    type: Object as PropType<Account>,
  },
  id: {
    default: "account-show",
    type: String,
  },
  tabs: {
    default: () => [],
    type: Array as PropType<AccountTab[]>,
  },
  activeKey: {
    default: "info",
    type: String,
  },
  visibleTabs: {
    default: () => ["info", "users", "invitations"],
    type: Array as PropType<string[]>,
  },
  persistState: {
    default: false,
    type: Boolean,
  },
});

const emit = defineEmits(["update:active-key", "visible-tabs-change"]);

const messages = useTranslations();
const { t } = useI18n({ messages });

const __saasAccountTabs = Symbol.for("saas.accountTabs");

const defaultTabList: AccountTab[] = [
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

const tabConfig = inject<(() => AccountTab[]) | AccountTab[]>(
  __saasAccountTabs,
  defaultTabList
);

const processedTabs = computed(() => {
  const additionalTabs =
    typeof tabConfig === "function"
      ? tabConfig()
      : Array.isArray(tabConfig)
        ? tabConfig
        : [];

  const allTabs = [...defaultTabList, ...props.tabs, ...additionalTabs];

  // Merge tabs with same key
  const mergedTabs = allTabs.reduce((accumulator, tab) => {
    const existingTab = accumulator.find((t) => t.key === tab.key);

    if (existingTab) {
      Object.assign(existingTab, tab);
    } else {
      accumulator.push(tab);
    }

    return accumulator;
  }, [] as AccountTab[]);

  // Filter tabs
  return mergedTabs.filter(
    (tab) => tab.display !== false && tab.component && tab.label
  );
});

const activeTabKey = computed(() => {
  return processedTabs.value.find((tab) => tab.key === props.activeKey)
    ? props.activeKey
    : processedTabs.value[0]?.key;
});

function getComponentByTabKey(tabKey: string): Component {
  return (
    processedTabs.value.find((tab) => tab.key === tabKey)?.component ||
    AccountDetails
  );
}

function handleTabChange(newActiveKey: string) {
  emit("update:active-key", newActiveKey);
}
</script>
