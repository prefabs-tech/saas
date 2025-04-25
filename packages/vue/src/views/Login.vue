<template>
  <Page :title="t('user.login.title')" class="auth login">
    <Errors v-if="errors.length" :errors="errors" />

    <slot name="instructions"></slot>

    <LoginForm :loading="loading" @submit="handleSubmit" />

    <div class="links">
      <router-link
        v-if="!config?.user?.routes?.signup.disabled"
        :to="{ name: 'signup' }"
        class="signup"
      >
        {{ t("user.login.links.signup") }}
      </router-link>
      <router-link :to="{ name: 'resetPasswordRequest' }" class="reset">
        {{ t("user.login.links.forgotPassword") }}
      </router-link>
    </div>

    <div v-if="config.user?.socialLogins?.length" class="divider"></div>

    <div class="social-logins">
      <GoogleLogin
        v-if="config.user?.socialLogins?.includes('google')"
        @error="onError"
      />
    </div>
  </Page>
</template>

<script lang="ts">
export default {
  name: "Login",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Errors, Page } from "@dzangolab/vue3-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { auth } from "../auth-provider";
import GoogleLogin from "../components/GoogleLogin.vue";
import LoginForm from "../components/LoginForm.vue";
import { useTranslations } from "../index";
import useUserStore from "../store";

import type { LoginCredentials } from "../types";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { Error as ErrorType } from "@dzangolab/vue3-ui";
import type { Ref } from "vue";

const config = useConfig() as AppConfig;

const selectedAuthProvider = auth();

const messages = useTranslations();

const { t } = useI18n({ messages });

const userStore = useUserStore();
const { getIsFirstUser, login, removeUser, setUser } = userStore;

const router = useRouter();

const errors = ref([]) as Ref<ErrorType[]>;

const loading = ref(false);

const handleSubmit = async (credentials: LoginCredentials) => {
  loading.value = true;

  const finalCredentials = {
    ...credentials,
    withRoles: config?.user?.supportedRoles,
  };

  await login(finalCredentials)
    .then(async (response) => {
      if (response) {
        const supportedRoles = config?.user?.supportedRoles;

        setUser(response);

        if (
          (supportedRoles &&
            (await selectedAuthProvider.verifySessionRoles(supportedRoles))) ||
          !supportedRoles?.length
        ) {
          router.push({ name: "home" });
        } else {
          removeUser();
        }
      }
    })
    .catch((error) => {
      errors.value = [
        {
          code: error.message,
          message: t(`user.login.errors.${error.message}`),
        },
      ];
    });

  loading.value = false;
};

const onError = (error: ErrorType) => {
  errors.value = [error];
};

const prepareComponent = async () => {
  loading.value = true;

  try {
    const response = await getIsFirstUser(config.apiBaseUrl);

    const userRoutes = config?.user?.routes;
    const firstUserSignupEnabled =
      userRoutes?.signup?.disabled && !userRoutes?.signupFirstUser?.disabled;

    if (response?.signUp && firstUserSignupEnabled) {
      router.push({ name: "signupFirstUser" });
    }
  } catch {
    // Do nothing
  } finally {
    loading.value = false;
  }
};

prepareComponent();
</script>

<style lang="css">
.auth.login .divider {
  border-top: 1px solid #d0d0d0;
  height: 0;
  margin: 1rem 0;
  width: 100%;
}
</style>
