<template>
  <div class="account-form">
    <div class="account-form__header">
      <h1>{{ isEdit ? $t('accounts.form.label.update') : $t('accounts.form.label.add') }}</h1>
      <router-link
        :to="{ name: 'accounts' }"
        class="button button--secondary"
      >
        {{ $t('accounts.form.actions.cancel') }}
      </router-link>
    </div>

    <div class="account-form__content">
      <form @submit.prevent="handleSubmit" class="form">
        <div class="form__group">
          <label for="name" class="form__label">
            {{ $t('accounts.form.label.name') }}
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form__input"
            required
          />
        </div>

        <div class="form__group">
          <label for="registeredNumber" class="form__label">
            {{ $t('accounts.form.label.registeredNumber') }}
          </label>
          <input
            id="registeredNumber"
            v-model="form.registeredNumber"
            type="text"
            class="form__input"
          />
        </div>

        <div class="form__group">
          <label for="taxId" class="form__label">
            {{ $t('accounts.form.label.taxId') }}
          </label>
          <input
            id="taxId"
            v-model="form.taxId"
            type="text"
            class="form__input"
          />
        </div>

        <div class="form__group">
          <label class="form__label">
            {{ $t('accounts.form.label.individual') }}
          </label>
          <div class="form__checkbox">
            <input
              id="individual"
              v-model="form.individual"
              type="checkbox"
              class="form__checkbox-input"
            />
            <label for="individual" class="form__checkbox-label">
              {{ $t('accounts.form.label.individual') }}
            </label>
          </div>
        </div>

        <div class="form__group">
          <label for="slug" class="form__label">
            {{ $t('accounts.form.label.slug') }}
          </label>
          <input
            id="slug"
            v-model="form.slug"
            type="text"
            class="form__input"
          />
        </div>

        <div class="form__group">
          <label for="database" class="form__label">
            {{ $t('accounts.form.label.database') }}
          </label>
          <input
            id="database"
            v-model="form.database"
            type="text"
            class="form__input"
          />
        </div>

        <div class="form__group">
          <label for="domain" class="form__label">
            {{ $t('accounts.form.label.domain') }}
          </label>
          <input
            id="domain"
            v-model="form.domain"
            type="text"
            class="form__input"
          />
        </div>

        <div class="form__actions">
          <button
            type="submit"
            class="button button--primary"
            :disabled="loading"
          >
            {{ isEdit ? $t('accounts.form.actions.update') : $t('accounts.form.actions.create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import useAccountsStore from '../../stores/accounts';
import type { AccountInput } from '../../types/account';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const accountsStore = useAccountsStore();
const { loading, error } = storeToRefs(accountsStore);

const isEdit = ref(false);
const form = ref<AccountInput>({
  name: '',
  registeredNumber: null,
  taxId: null,
  individual: false,
  slug: null,
  database: null,
  domain: null,
});

onMounted(async () => {
  const id = route.params.id as string;
  if (id) {
    isEdit.value = true;
    try {
      const account = await accountsStore.getAccount(id, API_BASE_URL);
      form.value = {
        name: account.name,
        registeredNumber: account.registeredNumber,
        taxId: account.taxId,
        individual: account.individual,
        slug: account.slug,
        database: account.database,
        domain: account.domain,
      };
    } catch (err) {
      console.error(err);
      router.push({ name: 'accounts' });
    }
  }
});

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await accountsStore.updateAccount(
        route.params.id as string,
        form.value,
        API_BASE_URL,
      );
    } else {
      await accountsStore.createAccount(form.value, API_BASE_URL);
    }
    router.push({ name: 'accounts' });
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
.account-form {
  padding: 2rem;
}

.account-form__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.account-form__content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form__group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form__label {
  font-weight: 500;
  color: #374151;
}

.form__input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form__checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form__checkbox-input {
  width: 1rem;
  height: 1rem;
}

.form__checkbox-label {
  color: #374151;
}

.form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.button--primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.button--primary:hover {
  background-color: #2563eb;
}

.button--primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.button--secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.button--secondary:hover {
  background-color: #f3f4f6;
}
</style> 