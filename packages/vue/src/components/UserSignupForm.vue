<template>
  <div class="user-signup-form">
    <Form @submit="onSubmit">
      <Email
        v-model="formData.email"
        :disabled="!!props.email"
        :label="t('account.signup.fields.email.label')"
        :placeholder="t('account.signup.fields.email.placeholder')"
        name="email"
        :schema="emailSchemaField"
      />

      <Password
        v-model="formData.password"
        :label="t('account.signup.fields.password.label')"
        :helper="t('account.signup.fields.password.helper')"
        name="password"
        :schema="passwordSchemaField"
      />

      <Password
        v-model="formData.confirmPassword"
        :label="t('account.signup.fields.confirmPassword')"
        name="confirmPassword"
        :schema="confirmPasswordSchemaField"
      />

      <template v-if="termsAndConditionsConfig?.display">
        <TermsAndConditions
          :has-checkbox="!!termsAndConditionsConfig?.showCheckbox"
          :route="termsAndConditionsConfig?.route"
          @update:check="disableButton = !$event"
        >
          <component
            :is="customTermsAndCondition"
            v-if="!!customTermsAndCondition"
          />
        </TermsAndConditions>
      </template>

      <div class="actions">
        <FormActions
          :actions="[
            {
              id: 'submit',
              label: t('account.signup.actions.signup'),
            },
          ]"
          :disabled="
            disableButton &&
            termsAndConditionsConfig?.display &&
            termsAndConditionsConfig?.showCheckbox
          "
          :loading="loading"
          alignment="filled"
          tabindex="0"
        />
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import {
  Email,
  emailSchema,
  FormActions,
  Form,
  Password,
  passwordSchema,
} from "@prefabs.tech/vue3-form";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { TermsAndConditions } from "@prefabs.tech/vue3-user";
import { inject, ref, computed, watch } from "vue";
import { z } from "zod";

import { useTranslations } from "../index";

import type { UserSignupData } from "../types/user";

export interface UserSignupFormProperties {
  email?: string;
  loading?: boolean;
}

const config = useConfig();

const customTermsAndCondition = inject("dzangolabVueUserTerms");

const disableButton = ref<boolean>(true);

const termsAndConditionsConfig =
  config.user?.features?.signUp?.termsAndConditions;

const props = withDefaults(defineProps<UserSignupFormProperties>(), {
  email: "",
  loading: false,
});

const emit = defineEmits<{
  submit: [userData: UserSignupData];
}>();

const messages = useTranslations();
const { t } = useI18n({ messages });

const formData = ref({
  email: props.email || "",
  password: "",
  confirmPassword: "",
  termsAndConditions: false,
});

// Create individual schemas for each field
const emailSchemaField = computed(() =>
  emailSchema(
    {
      invalid: t("account.signup.validations.email.invalid"),
      required: t("account.signup.validations.email.required"),
    },
    config?.user?.options?.email
  )
);

const passwordSchemaField = computed(() =>
  passwordSchema(
    {
      required: t("account.signup.validations.password.required"),
      weak: t("account.signup.validations.password.weak"),
    },
    config?.user?.options?.password
  )
);

const confirmPasswordSchemaField = computed(() =>
  z
    .string()
    .min(1, t("account.signup.validations.confirmPassword.required"))
    .refine((value) => value === formData.value.password, {
      message: t("account.signup.validations.confirmPassword.match"),
    })
);

// Watch for changes to the email prop and update formData
watch(
  () => props.email,
  (newEmail) => {
    if (newEmail) {
      formData.value.email = newEmail;
    }
  },
  { immediate: true }
);

function onSubmit() {
  const userData: UserSignupData = {
    email: formData.value.email,
    password: formData.value.password,
  };

  emit("submit", userData);
}
</script>

<style lang="css">
.user-signup-form {
  width: 100%;
}

.user-signup-form .actions {
  display: contents;
}
</style>
