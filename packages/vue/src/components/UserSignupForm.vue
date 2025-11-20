<template>
  <div class="user-signup-form">
    <Form :validation-schema="validationSchema" @submit="onSubmit">
      <Email
        v-model="formData.email"
        :disabled="!!props.email"
        :label="t('account.signup.fields.email.label')"
        :placeholder="t('account.signup.fields.email.placeholder')"
        name="email"
      />

      <Password
        v-model="formData.password"
        :label="t('account.signup.fields.password.label')"
        :helper="t('account.signup.fields.password.helper')"
        name="password"
      />

      <Password
        v-model="formData.confirmPassword"
        :label="t('account.signup.fields.confirmPassword')"
        name="confirmPassword"
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
          :actions="formActions"
          :disabled="
            disableButton &&
            termsAndConditionsConfig?.display &&
            termsAndConditionsConfig?.showCheckbox
          "
          :loading="loading"
          :alignment="signupActionsAlignment"
          :reverse="signupActionsReverse"
          :class="{ 'reverse-actions': signupActionsReverse }"
          tabindex="0"
          @cancel="handleCancel"
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
  Password,
  passwordSchema,
} from "@prefabs.tech/vue3-form";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { TermsAndConditions } from "@prefabs.tech/vue3-user";
import { toFormValidator } from "@vee-validate/zod";
import { Form } from "vee-validate";
import { computed, inject, ref, watch } from "vue";
import { z } from "zod";

import { CONFIG_UI_DEFAULT } from "../constant";
import { useTranslations } from "../index";
import { mapUiAlignmentToFormAlignment } from "../utils/ui";

import type { SaasConfig } from "../types/config";
import type { UserSignupData } from "../types/user";

export interface UserSignupFormProperties {
  actions?: Array<Record<string, unknown>>;
  email?: string;
  loading?: boolean;
}

const config = useConfig();

const saasConfig = inject<SaasConfig>(Symbol.for("saas.config"));
if (!saasConfig) {
  throw new Error("SAAS config not provided");
}

const customTermsAndCondition = inject("dzangolabVueUserTerms");

const disableButton = ref<boolean>(true);

const termsAndConditionsConfig =
  config.user?.features?.signUp?.termsAndConditions;

const signupFormUi = computed(
  () => saasConfig.ui?.signup?.form ?? CONFIG_UI_DEFAULT.signup.form
);

const signupActionsAlignment = computed(() =>
  mapUiAlignmentToFormAlignment(signupFormUi.value.actionsAlignment)
);

const signupActionsReverse = computed(() => signupFormUi.value.actionsReverse);

const props = withDefaults(defineProps<UserSignupFormProperties>(), {
  actions: undefined,
  email: "",
  loading: false,
});

const emit = defineEmits<{
  cancel: [];
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fieldSchema: Record<string, any> = {
  email: emailSchema(
    {
      invalid: t("account.signup.validations.email.invalid"),
      required: t("account.signup.validations.email.required"),
    },
    config?.user?.options?.email
  ),
  password: passwordSchema(
    {
      required: t("account.signup.validations.password.required"),
      weak: t("account.signup.validations.password.weak"),
    },
    config?.user?.options?.password
  ),
  confirmPassword: passwordSchema(
    {
      required: t("account.signup.validations.password.required"),
      weak: t("account.signup.validations.password.weak"),
    },
    { minLength: 0 }
  ),
};

const validationSchema = toFormValidator(
  z.object(fieldSchema).refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: t("account.signup.validations.confirmPassword.match"),
      path: ["confirmPassword"],
    }
  )
);

const formActions = computed(() => {
  const defaultActions = [
    {
      id: "submit",
      label: t("account.signup.actions.signup"),
      type: "submit",
    },
  ];

  if (props.actions && props.actions.length > 0) {
    // Merge provided actions with default submit action
    // If a submit action is provided, use it; otherwise append default submit
    const hasSubmit = props.actions.some(
      (action) => action.id === "submit" || action.type === "submit"
    );

    if (hasSubmit) {
      return props.actions;
    }

    return [...props.actions, ...defaultActions];
  }

  return defaultActions;
});

watch(
  () => props.email,
  (newEmail) => {
    if (newEmail) {
      formData.value.email = newEmail;
    }
  },
  { immediate: true }
);

function handleCancel() {
  emit("cancel");
}

function onSubmit(validatedData: Record<string, unknown>) {
  const userData: UserSignupData = {
    email: validatedData.email as string,
    password: validatedData.password as string,
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
