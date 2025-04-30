<template>
  <div class="account-form">
    <Form @submit="onSubmit">
      <Input
        v-model="formData.name"
        :label="t('customers.form.label.name')"
        name="name"
        type="text"
      />

      <SwitchInput
        v-model="formData.individual"
        :label="t('customers.form.label.individual')"
        name="individual"
      />

      <Input
        v-model="formData.registeredNumber"
        :label="t('customers.form.label.registeredNumber')"
        name="registeredNumber"
        type="text"
      />

      <Input
        v-model="formData.taxId"
        :label="t('customers.form.label.taxId')"
        name="taxId"
        type="text"
      />

      <Input
        v-model="formData.slug"
        :label="t('customers.form.label.slug')"
        name="slug"
        type="text"
      />

      <Input
        v-model="formData.domain"
        :disabled="isSlugEmpty"
        :label="t('customers.form.label.domain')"
        name="domain"
        type="text"
      />

      <SwitchInput
        v-if="!isUpdateMode"
        v-model="formData.useSeparateDatabase"
        :disabled="isSlugEmpty"
        :label="t('customers.form.label.useSeparateDatabase')"
        name="useSeparateDatabase"
      />

      <FormActions
        alignment="filled"
        :cancel-label="t('customers.form.actions.cancel')"
        :submit-label="
          isUpdateMode
            ? t('customers.form.actions.update')
            : t('customers.form.actions.create')
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
import { Form, FormActions, Input, SwitchInput } from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { ref, watch, onMounted, computed } from "vue";

import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";

import type { Account, AccountInput } from "../../types/account";
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

const formData = ref({} as AccountInput);

const isUpdateMode = computed(() => !!props.account);
const isSlugEmpty = computed(() => !formData.value.slug);

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
  const defaultFormData: Partial<AccountInput> = {
    name: "",
    individual: false,
    registeredNumber: "",
    taxId: "",
    slug: "",
    domain: "",
    useSeparateDatabase: false,
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
    } as AccountInput;
  } else {
    formData.value = {
      ...defaultFormData,
      individual: false,
      useSeparateDatabase: false,
    } as AccountInput;
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
