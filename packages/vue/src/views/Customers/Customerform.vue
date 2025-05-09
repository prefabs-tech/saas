<template>
  <div class="account-form">
    <Form @submit="onSubmit">
      <Input
        v-model="formData.name"
        :label="t('customers.form.label.name')"
        name="name"
        type="text"
        :schema="nameSchema"
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
        :schema="registeredNumberSchema"
      />

      <Input
        v-model="formData.taxId"
        :label="t('customers.form.label.taxId')"
        name="taxId"
        type="text"
        :schema="taxIdSchema"
      />

      <Input
        v-model="formData.slug"
        :label="t('customers.form.label.slug')"
        name="slug"
        type="text"
        :schema="slugSchema"
      />

      <Input
        v-model="formData.domain"
        :disabled="isSlugEmpty"
        :label="t('customers.form.label.domain')"
        name="domain"
        type="text"
        :schema="domainSchema"
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
import { z } from "zod";

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

const emit = defineEmits(["cancel", "submit"]);

const config = useConfig() as AppConfig;
const accountsStore = useAccountsStore();
const { createAccount, updateAccount } = accountsStore;
const messages = useTranslations();
const { t } = useI18n({ messages });

const formData = ref({} as AccountInput);

const isUpdateMode = computed(() => !!props.account);
const isSlugEmpty = computed(() => !formData.value.slug);

const nameSchema = z
  .string()
  .min(1, { message: t("customers.form.validations.name.required") })
  .max(255, { message: t("customers.form.validations.name.invalid") });

const registeredNumberSchema = z.string().max(255, {
  message: t("customers.form.validations.registeredNumber.invalid"),
});

const taxIdSchema = z
  .string()
  .max(255, { message: t("customers.form.validations.taxId.invalid") });

const slugSchema = z
  .string()
  .regex(/^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/, {
    message: t("customers.form.validations.slug.invalid"),
  });

const domainSchema = z
  .string()
  .max(255)
  .regex(/^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/, {
    message: t("customers.form.validations.domain.invalid"),
  });

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

  emit("submit");
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
