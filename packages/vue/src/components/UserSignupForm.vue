<template>
  <div class="user-signup-form">
    <Form :validation-schema="validationSchema" @submit="onSubmit">
      <Email
        v-model="formData.email"
        :disabled="!!email"
        :label="t('account.signup.fields.email.label')"
        :placeholder="t('account.signup.fields.email.placeholder')"
      />
      <!-- <Input
        v-model="formData.email"
        :label="t('account.signup.fields.email.label')"
        :placeholder="t('account.signup.fields.email.placeholder')"
        :schema="emailSchema"
        name="email"
        type="email"
        :disabled="!!email"
      /> -->

      <Password
        v-model="formData.password"
        :label="t('account.signup.fields.password.label')"
        name="password"
      />

      <!-- <Input
        v-model="formData.password"
        :label="t('account.signup.fields.password.label')"
        :placeholder="t('account.signup.fields.password.placeholder')"
        :schema="passwordSchema"
        name="password"
        type="password"
      /> -->

      <Password
        :label="t('account.signup.fields.confirmPassword')"
        name="confirmation"
      />

      <!-- <Input
        v-model="formData.confirmPassword"
        :label="t('account.signup.fields.confirmPassword')"
        :placeholder="t('account.signup.fields.confirmPassword')"
        :schema="confirmPasswordSchema"
        name="confirmPassword"
        type="password"
      /> -->

      <!-- <div class="terms-checkbox">
        <input
          id="termsAndConditions"
          v-model="formData.termsAndConditions"
          type="checkbox"
          name="termsAndConditions"
        />
        <label for="termsAndConditions">
          {{ t("account.signup.termsAndConditions") }}
        </label>
      </div> -->

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

      <!-- <TermsAndConditions
        :has-checkbox="!!termsAndConditionsConfig?.showCheckbox"
        @update:check="disableButton = !$event"
      >
        <component
          :is="customTermsAndCondition"
          v-if="!!customTermsAndCondition"
        />
      </TermsAndConditions> -->

      <div class="actions">
        <LoadingButton
          :disabled="
            disableButton &&
            termsAndConditionsConfig?.display &&
            termsAndConditionsConfig?.showCheckbox
          "
          :label="t('account.signup.actions.signup')"
        />
      </div>

      <!-- <ButtonElement
        type="submit"
        class="submit-button"
        :label="t('account.signup.actions.signup')"
        :loading="loading"
        @click="onSubmit"
      >
        {{ t("account.signup.actions.signup") }}
      </ButtonElement> -->
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import {
  Email,
  emailSchema,
  Password,
  passwordSchema,
} from "@prefabs.tech/vue3-form";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { LoadingButton } from "@prefabs.tech/vue3-ui";
import { TermsAndConditions } from "@prefabs.tech/vue3-user";
import { toFormValidator } from "@vee-validate/zod";
import { inject, ref, watch } from "vue";
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

// Watch for email prop changes
watch(
  () => props.email,
  (newEmail) => {
    if (newEmail) {
      formData.value.email = newEmail;
    }
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fieldSchema: Record<string, any> = {
  email: emailSchema(
    {
      invalid: t("user.signup.form.email.errors.invalid"),
      required: t("user.signup.form.email.errors.required"),
    },
    config?.user?.options?.email
  ),
  password: passwordSchema(
    {
      required: t("user.signup.form.password.errors.required"),
      weak: t("user.signup.form.password.errors.weak"),
    },
    config?.user?.options?.password
  ),
  confirmation: passwordSchema(
    {
      required: t("user.signup.form.password.errors.required"),
      weak: t("user.signup.form.password.errors.weak"),
    },
    { minLength: 0 }
  ),
};

const validationSchema = toFormValidator(
  z.object(fieldSchema).refine(
    (data) => {
      return data.password === data.confirmation;
    },
    {
      message: t("user.signup.form.confirmation.errors.match"),
      path: ["confirmation"],
    }
  )
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
