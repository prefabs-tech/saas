<template>
  <div class="account-card" :class="{ 'account-card--active': active }">
    <div class="account-card__main">
      <div class="account-card__info">
        <h3 class="account-card__name">{{ account.name }}</h3>
        <BadgeComponent
          :label="
            t(
              `account.type.${account.individual ? 'individual' : 'organization'}.label`
            )
          "
          :severity="'info'"
          size="small"
        />
      </div>
      <div class="account-card__action">
        <BadgeComponent
          v-if="active"
          :label="t('accounts.account.active')"
          severity="success"
          size="small"
        />
        <ButtonElement
          v-else
          :loading="loading"
          :label="t('accounts.account.actions.switch')"
          icon-left="pi pi-arrow-right-arrow-left"
          size="small"
          variant="outlined"
          severity="secondary"
          class="account-card__button"
          @click="$emit('switch', account)"
        />
      </div>
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
  border-radius: 12px;
  padding: 1rem;
  background: var(--surface-card);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.account-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.account-card__main {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.account-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.account-card__name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  word-break: break-word;
}

.account-card__action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.account-card__button {
  min-width: auto;
  white-space: nowrap;
}

.account-card .badge {
  margin-bottom: 0;
}

@media (min-width: 768px) {
  .account-card {
    padding: 1.5rem;
  }

  .account-card__main {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .account-card__info {
    gap: 0.75rem;
    flex: 1;
  }

  .account-card__name {
    font-size: 1.25rem;
  }
}

/* Desktop and up */
@media (min-width: 992px) {
  .account-card {
    padding: 2rem;
  }

  .account-card__name {
    font-size: 1.375rem;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .account-card--active {
    background: rgba(var(--primary-color-rgb), 0.1);
  }
}
</style>
