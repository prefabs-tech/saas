<template>
  <Form @submit="onSubmit">
    <Input
      v-if="config?.user?.features?.loginType === LOGIN_TYPE_USERNAME"
      :label="t('user.login.form.username.label')"
      :model-value="credentials.username"
      :name="'username'"
      :placeholder="t('user.login.form.username.placeholder')"
    />

    <Email
      v-else
      v-model="credentials.email"
      :error-messages="{
        invalid: t('user.login.form.email.errors.invalid'),
        required: t('user.login.form.email.errors.required'),
      }"
      :label="t('user.login.form.email.label')"
      :placeholder="t('user.login.form.email.placeholder')"
    />

    <Password
      v-model="credentials.password"
      :error-messages="{
        required: t('user.login.form.password.errors.required'),
        weak: t('user.login.form.password.errors.invalid'),
      }"
      :label="t('user.login.form.password.label')"
      :options="{ minLength: 6 }"
    />

    <div class="actions">
      <LoadingButton
        :label="t('user.login.form.actions.submit')"
        :loading="loading"
        tabindex="0"
      />
    </div>
  </Form>
</template>

<script lang="ts">
export default {
  name: "LoginForm",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { Email, Input, Password } from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { LoadingButton } from "@dzangolab/vue3-ui";
import { Form } from "vee-validate";

import { LOGIN_TYPE_USERNAME } from "../constant";
import { useTranslations } from "../index";

import type { LoginCredentials } from "../types";

const config = useConfig();

const messages = useTranslations();

const { t } = useI18n({ messages });

let credentials = {
  email: undefined,
  password: undefined,
  username: undefined,
} as Partial<LoginCredentials>;

const emit = defineEmits(["submit"]);

const onSubmit = (credentials: LoginCredentials) => {
  emit("submit", credentials);
};

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
