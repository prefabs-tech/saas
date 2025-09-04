<template>
  <div v-if="accounts && accounts.length > 0">
    <!-- <small v-if="!noHelperText" class="account-switcher-helper">{{
      t("accounts.switcher.helper")
    }}</small> -->

    <LoadingIcon v-if="loading" />

    <nav
      v-else
      ref="accountSwitcherReference"
      class="account-switcher"
      :class="{ expanded: expanded }"
    >
      <div class="account-trigger" @click="toggle">
        <div class="account-name truncated">
          {{
            activeAccount?.name ||
            props.emptyLabel ||
            t("accounts.switcher.emptyLabel")
          }}
        </div>
        <span class="truncated">
          <svg
            aria-label="open account menu"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
      <ul class="dropdown">
        <li
          v-for="account in accounts"
          :key="account.id"
          :class="{ current: account.id === activeAccount?.id }"
          class="truncated"
          @click="selectAccount(account)"
        >
          {{ account.name }}
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { LoadingIcon } from "@prefabs.tech/vue3-ui";
import { onClickOutside } from "@vueuse/core";
import { defineProps, defineEmits, ref, computed } from "vue";

import { useTranslations } from "../../index";
import { useMyAccountsStore } from "../../stores/myAccounts";

import type { Account } from "../../types/account";

export interface AccountSwitcherProperties {
  emptyLabel?: string;
  noHelperText?: boolean;
}

export interface AccountSwitcherEmits {
  (event: "switch", account?: Account): void;
}

const props = withDefaults(defineProps<AccountSwitcherProperties>(), {
  emptyLabel: "",
  noHelperText: false,
});

const emit = defineEmits<AccountSwitcherEmits>();

const messages = useTranslations();
const { t } = useI18n({ messages });

const myAccountsStore = useMyAccountsStore();
// Don't destructure to maintain reactivity
const accounts = computed(() => myAccountsStore.accounts);
const activeAccount = computed(() => myAccountsStore.activeAccount);
const loading = computed(() => myAccountsStore.loading);
const { switchAccount } = myAccountsStore;

// Dropdown state
const expanded = ref(false);
const accountSwitcherReference = ref(null);

// Toggle dropdown
const toggle = () => {
  expanded.value = !expanded.value;
};

// Select account and close dropdown
const selectAccount = (account: Account) => {
  if (account.id === activeAccount.value?.id) {
    expanded.value = false;
    return;
  }

  switchAccount(account);
  emit("switch", account);

  expanded.value = false;

  // Refresh the page to update all components with the new account
  window.location.reload();
};

// Close dropdown when clicking outside
onClickOutside(accountSwitcherReference, () => {
  expanded.value = false;
});
</script>

<style scoped>
.account-switcher-helper {
  color: var(--text-color-secondary, #6b7280);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  display: block;
}

nav.account-switcher {
  --_hover-bg: var(--nav-item-hover-bg, #f0f2f7ad);
  --_hover-color: var(--nav-item-hover-color, #2c2c2c);
  --_width: var(--account-switcher-width, 12rem);

  border-radius: 0.325rem;
  cursor: pointer;
  padding: 0;
  position: relative;
  width: var(--_width);
}

nav.account-switcher.expanded,
nav.account-switcher:hover {
  background: var(--_hover-bg);
  color: var(--_hover-color);
}

nav.account-switcher > .account-trigger {
  --_padding-h: var(--account-switcher-padding-h, 1rem);
  --_padding-v: var(--account-switcher-padding-v, 0.625rem);

  align-items: center;
  display: flex;
  gap: 0;
  justify-content: space-between;
  padding: var(--_padding-v) var(--_padding-h);
}

.account-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

nav.account-switcher > .account-trigger > span {
  font-size: 1.5rem;
  line-height: 1.25rem;
  text-align: center;
  width: 1rem;
}

nav.account-switcher > ul.dropdown {
  --_bg-color: var(--account-switcher-bg-color, #fff);
  --_border: var(--account-switcher-border, 1px solid #e5e5e5);
  --_min-width: var(--account-switcher-width, 12rem);

  background-color: var(--_bg-color);
  border: var(--_border);
  border-radius: 0.325rem;
  box-shadow: 0 2px 5px #0000001a;
  display: none;
  list-style: none;
  min-width: var(--_min-width);
  padding-inline-start: 0;
  padding: 0.15rem 0;
  position: absolute;
  right: 0;
  top: 120%;
  z-index: 1000;
}

nav.account-switcher.expanded ul {
  display: block;
}

nav.account-switcher > .dropdown > li {
  --_active-bg: var(--nav-item-active-bg, #eff6ff);
  --_active-color: var(--nav-item-active-color, #2c2c2c);
  --_hover-bg: var(--nav-item-hover-bg, #f0f2f7ad);
  --_hover-color: var(--nav-item-hover-color, #2c2c2c);

  cursor: pointer;
  list-style: none;
  padding: 0.7rem 1.25rem;
}

nav.account-switcher.expanded li:hover {
  background: var(--_hover-bg);
  color: var(--_hover-color);
}

nav.account-switcher > .dropdown > li.current {
  background-color: var(--_active-bg);
  color: var(--_active-color);
}

.account-switcher .truncated {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-switcher .truncated > svg {
  transition: transform 0.3s ease;
}

nav.account-switcher.expanded .truncated > svg {
  transform: rotate(-180deg);
}
</style>
