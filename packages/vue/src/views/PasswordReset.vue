<template>
  <Page :title="t('user.passwordReset.title')" class="auth password-reset">
    <slot name="instructions"></slot>

    <PasswordResetForm @submit="handleSubmit" />
  </Page>
</template>

<script lang="ts">
export default {
  name: "PasswordReset",
};
</script>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { Page } from "@dzangolab/vue3-ui";
import { useRouter } from "vue-router";

import PasswordResetForm from "../components/PasswordResetForm.vue";
import { useTranslations } from "../index";
import useUserStore from "../store";

import type { PasswordResetPayload } from "../types";

const messages = useTranslations();

const { t } = useI18n({ messages });

const { resetPassword } = useUserStore();

const router = useRouter();

const handleSubmit = async (payload: PasswordResetPayload) => {
  await resetPassword(payload).then(() => {
    router.push({ name: "login" });
  });
};
</script>
