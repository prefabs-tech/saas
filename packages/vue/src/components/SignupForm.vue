<template>
  <Form :validation-schema="validationSchema" @submit="onSubmit">
    <Email
      v-model="signupCredentials.email"
      :disabled="!!(token && invitation?.email)"
      :label="t('user.signup.form.email.label')"
      :placeholder="t('user.signup.form.email.placeholder')"
    />

    <Input
      v-if="config?.user?.features?.loginType === LOGIN_TYPE_USERNAME"
      v-model="signupCredentials.username"
      :label="t('user.signup.form.username.label')"
      :placeholder="t('user.signup.form.username.placeholder')"
      name="username"
      type="text"
    />

    <Password
      v-model="signupCredentials.password"
      :label="t('user.signup.form.password.label')"
      name="password"
    />

    <Password
      :label="t('user.signup.form.confirmation.label')"
      name="confirmation"
    />

    <TermsAndConditions
      v-if="termsAndConditionsConfig?.display"
      :has-checkbox="!!termsAndConditionsConfig?.showCheckbox"
      :label="hasLabelText ? termsAndConditionsConfig?.label : undefined"
      @update:check="disableButton = !$event"
    >
      <template v-if="termsAndConditionsConfig?.label && !hasLabelText">
        <component :is="termsAndConditionsConfig?.label" />
      </template>
    </TermsAndConditions>

    <div class="actions">
      <LoadingButton
        :disabled="
          disableButton &&
          termsAndConditionsConfig?.display &&
          termsAndConditionsConfig?.showCheckbox
        "
        :label="t('user.signup.form.actions.submit')"
      />
    </div>
  </Form>
</template>

<script lang="ts">
export default {
  name: "SignupForm",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import {
  Email,
  emailSchema,
  Input,
  Password,
  passwordSchema,
} from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { LoadingButton } from "@dzangolab/vue3-ui";
import { toFormValidator } from "@vee-validate/zod";
import { storeToRefs } from "pinia";
import { Form } from "vee-validate";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

import { LOGIN_TYPE_USERNAME } from "../constant";
import { useTranslations } from "../index";
import TermsAndConditions from "./TermsAndConditions.vue";
import useUserStore from "../store";

import type { LoginCredentials } from "../types";

const emit = defineEmits(["submit"]);

const config = useConfig();

const messages = useTranslations();

const route = useRoute();

const { t } = useI18n({ messages });

const token = route.params?.token as string;

const userStore = useUserStore();
const { invitation } = storeToRefs(userStore);

const termsAndConditionsConfig =
  config.user?.features?.signUp?.termsAndConditions;

const signupCredentials = reactive({
  email: token ? invitation.value?.email : undefined,
  password: undefined,
}) as Partial<LoginCredentials>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fieldSchema: Record<string, any> = {
  email: emailSchema(
    {
      invalid: t("user.signup.form.email.errors.invalid"),
      required: t("user.signup.form.email.errors.required"),
    },
    config?.user?.options?.email,
  ),
  password: passwordSchema(
    {
      required: t("user.signup.form.password.errors.required"),
      weak: t("user.signup.form.password.errors.weak"),
    },
    config?.user?.options?.password,
  ),
  confirmation: passwordSchema(
    {
      required: t("user.signup.form.password.errors.required"),
      weak: t("user.signup.form.password.errors.weak"),
    },
    { minLength: 0 },
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
    },
  ),
);

const disableButton = ref<boolean>(true);

const hasLabelText = computed(
  () =>
    typeof termsAndConditionsConfig?.label === "string" ||
    termsAndConditionsConfig?.label instanceof String,
);

const onSubmit = (credentials: LoginCredentials) => {
  emit("submit", credentials);
};

onMounted(() => {
  if (config?.user?.features?.loginType === LOGIN_TYPE_USERNAME) {
    fieldSchema.username = z
      .string({
        invalid_type_error: t("user.signup.form.username.errors.invalid"),
        required_error: t("user.signup.form.username.errors.required"),
      })
      .min(1, {
        message: t("user.signup.form.username.errors.required"),
      });
  }
});
</script>
