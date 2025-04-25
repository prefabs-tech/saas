<template>
  <Page
    class="auth password-reset-acknowledge"
    :title="t('user.password-reset-acknowledge.title')"
  >
    <main>
      <i18n-t
        class="acknowledge"
        keypath="user.password-reset-acknowledge.content"
        tag="p"
      >
        <span class="email">{{ route.query.email }}</span>
      </i18n-t>

      <nav class="links">
        <router-link :to="{ name: 'login' }">
          <Button :label="t('user.password-reset-acknowledge.actions.login')" />
        </router-link>
      </nav>

      <i18n-t
        class="redirect"
        keypath="user.password-reset-acknowledge.redirect"
        tag="p"
      >
        <span class="seconds">{{ seconds }}</span>
      </i18n-t>
    </main>
  </Page>
</template>

<script lang="ts">
export default {
  name: "PasswordResetRequestAcknowledge",
};
</script>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { LoadingButton as Button, Page } from "@dzangolab/vue3-ui";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useTranslations } from "../index";

import "../assets/css/auth.css";

const messages = useTranslations();

const { t } = useI18n({ messages });

const route = useRoute();
const router = useRouter();

let seconds = ref<number>(10);

const redirectCountDown = () => {
  if (!route.query.email) {
    seconds.value = 0;
    router.push({ name: "login" });
  }

  if (seconds.value > 0) {
    setTimeout(() => {
      seconds.value--;
      redirectCountDown();
    }, 1000);
  } else {
    router.push({ name: "login" });
  }
};

onMounted(() => {
  redirectCountDown();
});
</script>
