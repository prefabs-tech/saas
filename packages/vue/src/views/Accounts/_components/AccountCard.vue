<template>
  <div class="card" :class="{ active: active }">
    <div class="content">
      <div class="details">
        <h3 class="name">{{ account.name }}</h3>
        <BadgeComponent
          :label="
            t(
              `account.type.${account.individual ? 'individual' : 'organization'}.label`
            )
          "
          severity="primary"
          size="small"
        />
      </div>
      <div class="action">
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
          @click="$emit('switch', account)"
          class="button"
          icon-left="pi pi-arrow-right-arrow-left"
          severity="secondary"
          size="small"
          variant="outlined"
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
.action {
  align-items: center;
  display: flex;
  justify-content: flex-end;
}

.button {
  min-width: auto;
  white-space: nowrap;
}

.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card .badge {
  margin-bottom: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name {
  color: var(--text-color);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  word-break: break-word;
}

@media (min-width: 768px) {
  .card {
    padding: 1.25rem;
  }

  .content {
    align-items: flex-start;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
  }

  .details {
    flex: 1;
  }

  .name {
    font-size: 1.25rem;
  }
}

@media (min-width: 992px) {
  .card {
    padding: 1.5rem;
  }

  .name {
    font-size: 1.375rem;
  }
}

@media (prefers-color-scheme: dark) {
  .card.active {
    background: rgba(var(--primary-color-rgb), 0.1);
  }
}
</style>
