<template>
  <Page :title="t('user.signup.title')" class="auth signup">
    <Errors v-if="errors.length" :errors="errors" />

    <slot name="instructions"></slot>

    <SignupForm @submit="handleSubmit" />

    <div class="links">
      <router-link :to="{ name: 'login' }" class="login">
        {{ t("user.signup.links.login") }}
      </router-link>
      <router-link :to="{ name: 'resetPasswordRequest' }" class="reset">
        {{ t("user.signup.links.forgotPassword") }}
      </router-link>
    </div>
  </Page>
</template>

<script lang="ts">
export default {
  name: "Signup",
};
</script>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { Errors, Page } from "@dzangolab/vue3-ui";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

import SignupForm from "../components/SignupForm.vue";
import { useTranslations } from "../index";
import useUserStore from "../store";

import type { LoginCredentials } from "../types";
import type { Error as ErrorType } from "@dzangolab/vue3-ui";
import type { Ref } from "vue";

const messages = useTranslations();

const { t } = useI18n({ messages });

const userStore = useUserStore();
const { signup } = userStore;
const { user } = storeToRefs(userStore);

const router = useRouter();

const errors = ref([]) as Ref<ErrorType[]>;

const handleSubmit = async (credentials: LoginCredentials) => {
  await signup(credentials).catch((error) => {
    errors.value = [
      {
        code: error.message,
        message: t(`user.signup.errors.${error.message}`),
      },
    ];
  });

  if (user.value) {
    router.push({ name: "home" });
  }
};
</script>
