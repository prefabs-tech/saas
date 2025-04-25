<template>
  <Page
    :loading="loading"
    :title="t('user.firstUser.title')"
    centered
    class="auth signup"
  >
    <Card v-if="isError">
      <p>{{ t("user.signup.errors.SOMETHING_WRONG") }}</p>
    </Card>

    <SignupForm v-else @submit="handleSubmit" />
  </Page>
</template>

<script lang="ts">
export default {
  name: "SignupFirstUser",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Card, Page } from "@dzangolab/vue3-ui";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

import SignupForm from "../components/SignupForm.vue";
import { emitter, useTranslations } from "../index";
import useUserStore from "../store";

import type { LoginCredentials } from "../types";
import type { AppConfig } from "@dzangolab/vue3-config";

const config = useConfig() as AppConfig;

const messages = useTranslations();
const { t } = useI18n({ messages });

const router = useRouter();

const userStore = useUserStore();
const { getIsFirstUser, signUpFirstUser } = userStore;
const { user } = storeToRefs(userStore);

const isError = ref<boolean>(false);
const loading = ref<boolean>(true);

const handleSubmit = async (credentials: LoginCredentials) => {
  await signUpFirstUser(credentials, config.apiBaseUrl)
    .then(() => {
      emitter.emit("notify", {
        text: t("user.firstUser.signup.messages.success"),
        type: "success",
      });
    })
    .catch(() => {
      emitter.emit("notify", {
        text: t("user.firstUser.signup.messages.error"),
        type: "error",
      });
    });

  if (user.value) {
    emitter.emit("notify", {
      text: t("user.login.messages.success"),
      type: "success",
    });

    router.push({ name: "home" });
  } else {
    emitter.emit("notify", {
      text: t("user.firstUser.login.messages.error"),
      type: "error",
    });

    router.push({ name: "login" });
  }
};

const prepareComponent = async () => {
  try {
    const response = await getIsFirstUser(config.apiBaseUrl);

    if (!response?.signUp) {
      router.push({ name: "login" });
    }
  } catch (error) {
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

prepareComponent();
</script>
