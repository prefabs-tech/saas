<template>
  <GoogleSignInButton
    :label="t('user.login.social.google')"
    :loading="loading"
    @click="onGoogleSignIn"
  />
</template>

<script lang="ts">
export default {
  name: "GoogleLogin",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { GoogleSignInButton } from "@dzangolab/vue3-ui";
import { ref } from "vue";

import { useTranslations } from "../index";
import useUserStore from "../store";

const config = useConfig();
const messages = useTranslations();
const { googleSignIn } = useUserStore();

const { t } = useI18n({ messages });

const loading = ref(false);

const emit = defineEmits(["error"]);

const onGoogleSignIn = async () => {
  loading.value = true;

  try {
    const response = await googleSignIn(config.websiteDomain);
    loading.value = false;
  } catch (error) {
    emit("error", error);
    loading.value = false;
  }
};
</script>
