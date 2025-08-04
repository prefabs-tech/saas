<template>
  <div class="user-signup-form">
    <Form @submit="onSubmit">
      <Input
        v-model="formData.email"
        :label="t('account.signup.fields.email.label')"
        :placeholder="t('account.signup.fields.email.placeholder')"
        :schema="emailSchema"
        name="email"
        type="email"
        :disabled="!!email"
      />

      <Input
        v-model="formData.password"
        :label="t('account.signup.fields.password.label')"
        :placeholder="t('account.signup.fields.password.placeholder')"
        :schema="passwordSchema"
        name="password"
        type="password"
      />

      <Input
        v-model="formData.confirmPassword"
        :label="t('account.signup.fields.confirmPassword')"
        :placeholder="t('account.signup.fields.confirmPassword')"
        :schema="confirmPasswordSchema"
        name="confirmPassword"
        type="password"
      />

      <div class="terms-checkbox">
        <input
          id="termsAndConditions"
          v-model="formData.termsAndConditions"
          type="checkbox"
          name="termsAndConditions"
        />
        <label for="termsAndConditions">
          {{ t("account.signup.termsAndConditions") }}
        </label>
      </div>

      <ButtonElement
        type="submit"
        class="submit-button"
        :label="t('account.signup.actions.signup')"
        :loading="loading"
        @click="onSubmit"
      >
        {{ t("account.signup.actions.signup") }}
      </ButtonElement>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form, Input } from "@prefabs.tech/vue3-form";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { ButtonElement } from "@prefabs.tech/vue3-ui";
import { computed, ref, watch } from "vue";

import { useTranslations } from "../index";
import {
  createEmailSchema,
  createPasswordSchema,
  createConfirmPasswordSchema,
} from "../validations/userValidation";

import type { UserSignupData } from "../types/user";

export interface UserSignupFormProperties {
  email?: string;
  loading?: boolean;
}

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

// Watch for email prop changes
watch(
  () => props.email,
  (newEmail) => {
    if (newEmail) {
      formData.value.email = newEmail;
    }
  }
);

// Form validation schemas
const emailSchema = createEmailSchema();
const passwordSchema = createPasswordSchema();
const confirmPasswordSchema = computed(() =>
  createConfirmPasswordSchema(formData.value.password)
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
