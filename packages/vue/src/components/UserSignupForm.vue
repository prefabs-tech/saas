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
        <LoadingButton
          :disabled="
            disableButton &&
            termsAndConditionsConfig?.display &&
            termsAndConditionsConfig?.showCheckbox
          "
          :loading="props.loading"
          :label="t('account.signup.actions.signup')"
          type="submit"
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
  Form,
  Password,
  passwordSchema,
} from "@prefabs.tech/vue3-form";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { LoadingButton } from "@prefabs.tech/vue3-ui";
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
      invalid: t("account.user.signup.form.email.errors.invalid"),
      required: t("account.user.signup.form.email.errors.required"),
    },
    config?.user?.options?.email
  )
);

const passwordSchemaField = computed(() =>
  passwordSchema(
    {
      required: t("account.user.signup.form.password.errors.required"),
      weak: t("account.user.signup.form.password.errors.weak"),
    },
    config?.user?.options?.password
  )
);

const confirmPasswordSchemaField = computed(() =>
  z
    .string()
    .min(1, t("account.user.signup.form.password.errors.required"))
    .refine((value) => value === formData.value.password, {
      message: t("account.user.signup.form.confirmation.errors.match"),
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

.user-signup-form .submit-button {
  width: 100%;
  margin-top: 1rem;
}

.user-signup-form .terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 1rem 0;
}

.user-signup-form .terms-checkbox input[type="checkbox"] {
  margin-top: 0.25rem;
}

.user-signup-form .terms-checkbox label {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.4;
  cursor: pointer;
}
</style>
