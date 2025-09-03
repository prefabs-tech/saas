<template>
  <div class="account-card" :class="{ 'account-card--active': active }">
    <div class="account-card__header">
      <h3 class="account-card__title">{{ account.name }}</h3>
      <div class="account-card__actions">
        <BadgeComponent
          v-if="active"
          :label="t('accounts.account.active')"
          severity="success"
        />
        <ButtonElement
          v-else
          :loading="loading"
          :label="t('accounts.account.actions.switch')"
          icon-left="pi pi-arrow-right-arrow-left"
          size="small"
          variant="outlined"
          severity="secondary"
          @click="$emit('switch', account)"
        />
      </div>
    </div>

    <div class="account-card__content">
      <p class="account-card__type">
        {{
          t(
            `account.type.${account.individual ? "individual" : "organization"}.label`
          )
        }}
      </p>
      <p v-if="account.slug" class="account-card__slug">
        {{ account.slug }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { BadgeComponent, ButtonElement } from "@prefabs.tech/vue3-ui";

import { useTranslations } from "../../../index";

import type { Account } from "../../../types/account";
import type { PropType } from "vue";

const messages = useTranslations();
const { t } = useI18n({ messages });

defineProps({
  account: {
    required: true,
    type: Object as PropType<Account>,
  },
  active: {
    default: false,
    type: Boolean,
  },
  loading: {
    default: false,
    type: Boolean,
  },
});

defineEmits<{
  switch: [account: Account];
}>();
</script>

<style scoped>
.account-card {
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  background: var(--surface-card);
  transition: all 0.2s ease;
}

.account-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-card--active {
  border-color: var(--primary-color);
  background: var(--primary-color-text);
}

.account-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.account-card__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.account-card__actions {
  flex-shrink: 0;
  margin-left: 1rem;
}

.account-card__content {
  color: var(--text-color-secondary);
}

.account-card__type {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.account-card__slug {
  margin: 0;
  font-family: monospace;
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>
