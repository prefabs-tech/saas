<template>
  <Page
    :title="
      isMainApp
        ? t('account.signup.title.account')
        : t('account.signup.title.user')
    "
    class="auth signup"
    :centered="true"
  >
    <AccountSignupForm
      v-if="isMainApp"
      :loading="loading"
      @submit="handleSubmit"
    />
    <UserSignupForm v-else :loading="loading" @submit="handleSubmit" />
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page } from "@prefabs.tech/vue3-ui";
import { computed, inject, ref } from "vue";

import { signup } from "../../api/accounts";
import AccountSignupForm from "../../components/AccountSignupForm.vue";
import UserSignupForm from "../../components/UserSignupForm.vue";
import { useMyAccounts } from "../../composables/useMyAccounts";
import { SIGNUP_PATH_DEFAULT } from "../../constant";
import { useTranslations } from "../../index";

import type { User } from "../../types/account";
import type { SaasEventHandlers } from "../../types/plugin";
import type { AccountSignupData, UserSignupData } from "../../types/user";
import type { AppConfig } from "@prefabs.tech/vue3-config";

export interface SignupProperties {
  onSignupFailure?: (
    err?: unknown,
    data?: UserSignupData | AccountSignupData
  ) => Promise<void> | void;
  onSignupSuccess?: (
    res?: User,
    data?: UserSignupData | AccountSignupData
  ) => Promise<void> | void;
}

const props = withDefaults(defineProps<SignupProperties>(), {
  onSignupFailure: undefined,
  onSignupSuccess: undefined,
});

const config = useConfig() as AppConfig;
const messages = useTranslations();
const { t } = useI18n({ messages });

const myAccountsStore = useMyAccounts();
const isMainApp = computed(() => myAccountsStore.meta.isMainApp);

const saasConfig = inject<import("../../types/config").SaasConfig>(
  Symbol.for("saas.config")
);

if (!saasConfig) {
  throw new Error("SAAS config not provided");
}

const { apiPath = SIGNUP_PATH_DEFAULT, appRedirection = true } =
  saasConfig.accounts?.signup || {};

const loading = ref(false);

const __saasEventHandlers = Symbol.for("saas.eventHandlers");
const eventHandlers = inject<SaasEventHandlers>(__saasEventHandlers);

const handleSubmit = async (data: AccountSignupData | UserSignupData) => {
  loading.value = true;

  try {
    const result = await signup({
      apiBaseUrl: config.apiBaseUrl,
      path: apiPath,
      data,
      accountSignup: isMainApp.value,
    });

    if (result) {
      if (props.onSignupSuccess) {
        await props.onSignupSuccess(result, data);
      }

      if (appRedirection && isMainApp.value && "slug" in data && data.slug) {
        const appUrl = `${window.location.protocol}//${data.slug}.${saasConfig.rootDomain}`;

        // FIXME Quick solution. Use a better way to handle redirection
        window.location.replace(appUrl);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Signup failed:", error);

    if (props.onSignupFailure) {
      await props.onSignupFailure(error, data);
    }

    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "error",
        message: t("account.signup.messages.error"),
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.signup-content {
  margin: 0 auto;
  max-width: 430px;
  width: 100%;
}
</style>
