<template>
  <div v-if="loading">{{ t("user.loading") }}</div>
</template>

<script lang="ts">
export default {
  name: "AuthGoogleCallBack",
};
</script>

<script lang="ts" setup>
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import ThirdPartyEmailPassword from "supertokens-web-js/recipe/thirdpartyemailpassword";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useTranslations } from "../index";
import useUserStore from "../store";
import { verifySessionRoles } from "../supertokens";

import type { UserType } from "../types";
import type { AppConfig } from "@dzangolab/vue3-config";

const config = useConfig() as AppConfig;

const messages = useTranslations();

const { t } = useI18n({ messages });

const loading = ref(false);
const router = useRouter();

const { setUser } = useUserStore();

onMounted(async () => {
  loading.value = true;

  const response = await ThirdPartyEmailPassword.thirdPartySignInAndUp({});

  if (response.status !== "OK") {
    return window.location.assign("/auth?error=signin");
  }

  if (response?.user) {
    const supportedRoles = config?.user?.supportedRoles;

    if (
      (supportedRoles && (await verifySessionRoles(supportedRoles))) ||
      !supportedRoles?.length
    ) {
      setUser(response.user as UserType);

      router.push({ name: "home" });
    }
  }

  loading.value = false;
});
</script>
