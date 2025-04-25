<template>
  <Page :title="t('user.changePassword.title')" class="auth change-password">
    <Errors v-if="errors.length" :errors="errors" />

    <slot name="instructions"></slot>

    <ChangePasswordForm :loading="loading" @submit="handleSubmit" />
  </Page>
</template>

<script lang="ts">
export default {
  name: "ChangePassword",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Errors, Page } from "@dzangolab/vue3-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";

import ChangePasswordForm from "../components/ChangePasswordForm.vue";
import { useTranslations } from "../index";
import useUserStore from "../store";

import type { ChangePasswordPayload } from "../types";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { Error as ErrorType } from "@dzangolab/vue3-ui";
import type { Ref } from "vue";

const config = useConfig() as AppConfig;

const messages = useTranslations();

const { t } = useI18n({ messages });

const userStore = useUserStore();
const { changePassword } = userStore;

const router = useRouter();

const errors = ref([]) as Ref<ErrorType[]>;

const loading = ref(false);

const handleSubmit = async (payload: ChangePasswordPayload) => {
  loading.value = true;

  await changePassword(payload, config?.apiBaseUrl)
    .then(async (response) => {
      if (response) {
        router.push({ name: "home" });
      }
    })
    .catch((error) => {
      errors.value = [
        {
          code: error.message,
          message: error.message,
        },
      ];
    });

  loading.value = false;
};
</script>
