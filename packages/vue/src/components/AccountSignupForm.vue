<template>
  <Form
    :initial-values="initialValues"
    :validation-schema="validationSchema"
    @submit="onSubmit"
  >
    <!-- Account Fields (Step 1) -->
    <div v-show="activeIndex === 0">
      <Input
        v-model="formData.name"
        :label="t('accounts.form.label.name')"
        name="name"
        type="text"
      />

      <template v-if="saasConfig.entity === 'both'">
        <SwitchInput
          v-model="formData.individual"
          :label="t('accounts.form.label.individual')"
          name="individual"
        />
      </template>

      <template v-if="shouldShowOrganizationFields">
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
      </template>

      <template v-if="saasConfig.subdomains !== 'disabled'">
        <Input
          v-model="formData.slug"
          :label="t('accounts.form.label.slug')"
          name="slug"
          type="text"
        />

        <SwitchInput
          v-if="saasConfig.multiDatabase"
          v-model="formData.useSeparateDatabase"
          :label="t('accounts.form.label.useSeparateDatabase')"
          name="useSeparateDatabase"
        />
      </template>
    </div>

    <!-- User Fields (Step 2) -->
    <UserSignupForm
      v-if="activeIndex === 1"
      :actions="userFormActions"
      :loading="loading"
      @submit="handleUserSignupSubmit"
      @cancel="activeIndex = 0"
    />

    <!-- Actions for Step 1 only -->
    <div v-if="activeIndex === 0" class="actions">
      <FormActions
        :actions="formActions"
        :loading="loading"
        alignment="filled"
        tabindex="0"
      />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { FormActions, Input, SwitchInput } from "@prefabs.tech/vue3-form";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { toFormValidator } from "@vee-validate/zod";
import { Form } from "vee-validate";
import { computed, inject, ref, watch } from "vue";
import { z } from "zod";

import UserSignupForm from "./UserSignupForm.vue";
import { useTranslations } from "../index";
import { createValidationSchemas } from "../views/Accounts/validations/accountValidations";

import type { SaasConfig } from "../types/config";
import type { AccountSignupData, UserSignupData } from "../types/user";

export interface AccountSignupFormProperties {
  loading?: boolean;
}

withDefaults(defineProps<AccountSignupFormProperties>(), {
  loading: false,
});

const emit = defineEmits<{
  submit: [userData: AccountSignupData];
}>();

const messages = useTranslations();
const { t } = useI18n({ messages });

const saasConfig = inject<SaasConfig>(Symbol.for("saas.config"));
if (!saasConfig) {
  throw new Error("SAAS config not provided");
}

const activeIndex = ref(0);

const { nameSchema, registeredNumberSchema, taxIdSchema, createSlugSchema } =
  createValidationSchemas();

const slugSchema = computed(() => createSlugSchema(saasConfig));

const formData = ref({
  // Account fields
  name: "",
  individual: saasConfig.entity === "individual",
  registeredNumber: "",
  taxId: "",
  slug: "",
  useSeparateDatabase: false,
  // User fields
  email: "",
  password: "",
  confirmPassword: "",
  termsAndConditions: false,
});

// Initial values for the form - matching React defaultValues
const initialValues = computed(() => ({
  name: formData.value.name,
  individual: formData.value.individual,
  registeredNumber: formData.value.registeredNumber,
  taxId: formData.value.taxId,
  slug: formData.value.slug,
  useSeparateDatabase: formData.value.useSeparateDatabase,
  email: formData.value.email,
  password: formData.value.password,
  confirmPassword: formData.value.confirmPassword,
  termsAndConditions: formData.value.termsAndConditions,
}));

const shouldShowOrganizationFields = computed(() => {
  if (saasConfig.entity === "organization") {
    return true;
  }

  if (saasConfig.entity === "both") {
    return !formData.value.individual;
  }

  return false;
});

// Account schema for step 1
const accountSchemaObject = computed(() => {
  const base = {
    name: nameSchema,
    individual: z.boolean(),
    registeredNumber: registeredNumberSchema.nullable(),
    taxId: taxIdSchema.nullable(),
    useSeparateDatabase: z.boolean().nullable(),
  };

  // Only include slug validation if subdomains is not disabled
  if (saasConfig.subdomains !== "disabled") {
    return {
      ...base,
      slug:
        saasConfig.subdomains === "required"
          ? slugSchema.value
          : z
              .string()
              .regex(
                /^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/,
                t("accounts.form.validations.slug.invalid")
              )
              .nullable()
              .optional()
              .or(z.literal("")),
    };
  }

  return base;
});

const accountSchema = computed(() =>
  toFormValidator(z.object(accountSchemaObject.value))
);

const validationSchema = computed(() => accountSchema.value);

const formActions = computed(() => [
  {
    id: "next",
    label: t("account.signup.actions.next"),
    type: "submit",
  },
]);

const userFormActions = computed(() => [
  {
    id: "cancel",
    label: t("account.signup.actions.previous"),
    onClick: () => {
      activeIndex.value = 0;
    },
    type: "button",
  },
]);

watch(
  () => formData.value.individual,
  (newValue: boolean) => {
    if (newValue) {
      formData.value.registeredNumber = "";
      formData.value.taxId = "";
    }
  }
);

function onSubmit(validatedData: Record<string, unknown>) {
  // Step 1 submission - validate account fields and advance to step 2
  // Update formData with validated values from step 1
  if (validatedData.name) {
    formData.value.name = validatedData.name as string;
  }
  if (typeof validatedData.individual === "boolean") {
    formData.value.individual = validatedData.individual;
  }
  if (validatedData.registeredNumber !== undefined) {
    formData.value.registeredNumber = validatedData.registeredNumber as string;
  }
  if (validatedData.taxId !== undefined) {
    formData.value.taxId = validatedData.taxId as string;
  }
  if (validatedData.slug !== undefined) {
    formData.value.slug = validatedData.slug as string;
  }
  if (typeof validatedData.useSeparateDatabase === "boolean") {
    formData.value.useSeparateDatabase = validatedData.useSeparateDatabase;
  }

  activeIndex.value = 1;
}

function handleUserSignupSubmit(userData: UserSignupData) {
  // Step 2 submission - merge account data from step 1 with user data from UserSignupForm
  const accountData: AccountSignupData = {
    ...userData,
    name: formData.value.name,
    individual: formData.value.individual,
    registeredNumber: formData.value.registeredNumber || null,
    taxId: formData.value.taxId || null,
    slug: formData.value.slug || null,
    useSeparateDatabase: formData.value.useSeparateDatabase || null,
  };

  emit("submit", accountData);
}
</script>

<!-- <style lang="css">
</style> -->
