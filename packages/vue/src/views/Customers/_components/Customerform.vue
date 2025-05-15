<template>
  <div class="customer-form">
    <Form @submit="onSubmit">
      <Input
        v-model="formData.name"
        :label="t('customers.form.label.name')"
        name="name"
        type="text"
        :schema="nameSchema"
      />

      <template v-if="saasConfig.entity === 'both'">
        <SwitchInput
          v-model="formData.individual"
          :label="t('customers.form.label.individual')"
          name="individual"
        />
      </template>

      <template v-if="!formData.individual">
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
      </template>

      <template v-if="saasConfig.subdomains !== 'disabled'">
        <Input
          v-model="formData.slug"
          :label="t('customers.form.label.slug')"
          name="slug"
          type="text"
          :schema="slugSchema"
        />

        <Input
          v-model="formData.domain"
          :disabled="!formData.slug"
          :label="t('customers.form.label.domain')"
          name="domain"
          type="text"
          :schema="domainSchema"
        />

        <SwitchInput
          v-if="saasConfig.multiDatabase && !isUpdateMode"
          v-model="formData.useSeparateDatabase"
          :disabled="!formData.slug"
          :label="t('customers.form.label.useSeparateDatabase')"
          name="useSeparateDatabase"
        />
      </template>

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
import { ref, computed, inject } from "vue";

import { useTranslations } from "../../../index";
import useAccountsStore from "../../../stores/accounts";
import { createValidationSchemas } from "../validations/customerValidations";

import type { Account, AccountInput } from "../../../types/account";
import type { SaasConfig } from "../../../types/config";
import type { PropType } from "vue";

const props = defineProps({
  account: {
    default: undefined,
    type: Object as PropType<Account>,
  },
  loading: Boolean,
});

const emit = defineEmits(["cancel", "submit"]);

const {
  nameSchema,
  registeredNumberSchema,
  taxIdSchema,
  createSlugSchema,
  domainSchema,
} = createValidationSchemas();

const accountsStore = useAccountsStore();
const config = useConfig();
const messages = useTranslations();
const saasConfig = inject<SaasConfig>(Symbol.for("saas.config"));
const { t } = useI18n({ messages });

if (!saasConfig) {
  throw new Error("SAAS config not provided");
}

const { createAccount, updateAccount } = accountsStore;

const formData = ref<AccountInput>({
  domain: undefined as unknown as string,
  individual: false,
  name: undefined as unknown as string,
  registeredNumber: undefined as unknown as string,
  slug: undefined as unknown as string,
  taxId: undefined as unknown as string,
  useSeparateDatabase: false,
} as AccountInput);

const isUpdateMode = computed(() => Boolean(props.account));

const slugSchema = computed(() => createSlugSchema(saasConfig));

const onSubmit = async () => {
  try {
    if (isUpdateMode.value && props.account?.id) {
      await updateAccount(props.account.id, formData.value, config.apiBaseUrl);
    } else {
      await createAccount(formData.value, config.apiBaseUrl);
    }

    emit("submit");
  } catch (error) {
    console.error("Form submission error:", error);
  }
};
</script>

<style lang="css">
.customer-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.customer-form .form-actions {
  margin-top: 1rem;
}

.customer-form .form-actions.direction-horizontal {
  flex-direction: row-reverse;
}
</style>
