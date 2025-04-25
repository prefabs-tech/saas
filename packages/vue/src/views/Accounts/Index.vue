<template>
  <div class="accounts">
    <div class="accounts__header">
      <h1>{{ $t('accounts.title') }}</h1>
      <router-link
        :to="{ name: 'accountForm' }"
        class="button button--primary"
      >
        {{ $t('accounts.table.actions.addAccount') }}
      </router-link>
    </div>

    <div class="accounts__content">
      <table v-if="accounts.length > 0" class="table">
        <thead>
          <tr>
            <th>{{ $t('accounts.table.columns.name') }}</th>
            <th>{{ $t('accounts.table.columns.registeredNumber') }}</th>
            <th>{{ $t('accounts.table.columns.taxId') }}</th>
            <th>{{ $t('accounts.table.columns.individual') }}</th>
            <th>{{ $t('accounts.table.columns.slug') }}</th>
            <th>{{ $t('accounts.table.columns.database') }}</th>
            <th>{{ $t('accounts.table.columns.domain') }}</th>
            <th>{{ $t('accounts.table.columns.createdAt') }}</th>
            <th>{{ $t('accounts.table.columns.updatedAt') }}</th>
            <th>{{ $t('accounts.table.columns.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in accounts" :key="account.id">
            <td>{{ account.name }}</td>
            <td>{{ account.registeredNumber }}</td>
            <td>{{ account.taxId }}</td>
            <td>{{ account.individual ? 'Yes' : 'No' }}</td>
            <td>{{ account.slug }}</td>
            <td>{{ account.database }}</td>
            <td>{{ account.domain }}</td>
            <td>{{ new Date(account.createdAt).toLocaleDateString() }}</td>
            <td>{{ new Date(account.updatedAt).toLocaleDateString() }}</td>
            <td>
              <div class="table__actions">
                <router-link
                  :to="{ name: 'accountForm', params: { id: account.id } }"
                  class="button button--small button--primary"
                >
                  {{ $t('accounts.table.actions.updateAccount') }}
                </router-link>
                <button
                  class="button button--small button--danger"
                  @click="deleteAccount(account.id)"
                >
                  {{ $t('accounts.table.actions.deleteAccount') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="accounts__empty">
        {{ $t('accounts.table.emptyMessage') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useAccountsStore from '../../stores/accounts';

const router = useRouter();
const { t } = useI18n();
const accountsStore = useAccountsStore();
const { accounts, loading, error } = storeToRefs(accountsStore);

onMounted(async () => {
  await accountsStore.getAccounts(import.meta.env.VITE_API_BASE_URL);
});

const deleteAccount = async (id: string) => {
  if (confirm(t('accounts.table.confirmation.deleteAccount.message'))) {
    try {
      await accountsStore.deleteAccount(id, import.meta.env.VITE_API_BASE_URL);
    } catch (err) {
      console.error(err);
    }
  }
};
</script>

<style scoped>
.accounts {
  padding: 2rem;
}

.accounts__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.accounts__content {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.table__actions {
  display: flex;
  gap: 0.5rem;
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

.button--danger {
  background-color: #ef4444;
  color: white;
  border: none;
}

.button--danger:hover {
  background-color: #dc2626;
}

.button--small {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.accounts__empty {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}
</style> 