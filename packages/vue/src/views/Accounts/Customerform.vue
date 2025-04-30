<template>
  <div class="account-form">
    <Form @submit="onSubmit">
      <Input
        v-model="formData.name"
        :label="t('accounts.form.label.name')"
        name="name"
        type="text"
      />
      <Input
        v-model="formData.registeredNumber"
        :label="t('accounts.form.label.registeredNumber')"
        name="registeredNumber"
        type="text"
      />
      <Input
        v-model="formData.taxId"
        :label="t('accounts.form.label.taxId')"
        name="taxId"
        type="text"
      />
      <Input
        v-model="formData.slug"
        :label="t('accounts.form.label.slug')"
        name="slug"
        type="text"
      />
      <Input
        v-model="formData.domain"
        :disabled="!!account"
        :label="t('accounts.form.label.domain')"
        name="domain"
        type="text"
      />

      <FormActions
        alignment="filled"
        :cancel-label="t('accounts.form.actions.cancel')"
        :submit-label="
          !!account
            ? t('accounts.form.actions.update')
            : t('accounts.form.actions.create')
        "
        :loading="loading"
        flow-direction="horizontal"
        @cancel="$emit('cancel')"
      />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { Form, FormActions, Input } from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { ref, watch, onMounted } from "vue";

import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";

import type { Account } from "../../types/account";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { PropType } from "vue";

const props = defineProps({
  account: {
    default: undefined,
    type: Object as PropType<Account>,
  },

  loading: Boolean,
});

defineEmits(["cancel", "submit"]);

const config = useConfig() as AppConfig;
const accountsStore = useAccountsStore();
const { createAccount, updateAccount } = accountsStore;
const messages = useTranslations();
const { t } = useI18n({ messages });

const formData = ref<Account>({} as Account);

onMounted(() => {
  prepareComponent();
});

function onCreateAccount() {
  createAccount(formData.value, config.apiBaseUrl);
}

function onUpdateAccount() {
  updateAccount(props.account?.id as string, formData.value, config.apiBaseUrl);
}

function onSubmit() {
  if (props.account && props.account.id) {
    onUpdateAccount();
  } else {
    onCreateAccount();
  }
}

const prepareComponent = () => {
  const defaultFormData: Partial<Account> = {
    name: "",
    individual: false,
    registeredNumber: "",
    taxId: "",
    slug: "",
    domain: "",
  };

  if (props.account) {
    formData.value = {
      ...defaultFormData,
      id: props.account.id,
      name: props.account.name,
      registeredNumber: props.account.registeredNumber,
      taxId: props.account.taxId,
      slug: props.account.slug,
      domain: props.account.domain,
    } as Account;
  } else {
    formData.value = {
      ...defaultFormData,
      individual: true,
    } as Account;
  }
};

watch(
  () => props.account,
  () => {
    prepareComponent();
  },
  { immediate: true },
);
</script>

<style lang="css">
.account-form button {
  width: 100%;
}

.account-form .form-actions.direction-vertical {
  flex-direction: column-reverse;
}
</style>
