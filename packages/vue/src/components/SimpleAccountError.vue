<template>
  <div class="account-error">
    <slot name="content">
      <h2>{{ t("account.error.title") }}</h2>
      <p>{{ t("account.error.message") }}</p>
      <p>{{ t("account.error.support") }}</p>
    </slot>

    <slot name="action" :go-to-home="goToHome">
      <button @click="goToHome">{{ t("account.error.goToHome") }}</button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { useRouter } from "vue-router";

import { useGlobalAccountError } from "../composables/useGlobalAccountError";
import { useTranslations } from "../index";

const router = useRouter();
const messages = useTranslations();
const { t } = useI18n({ messages });
const { clearError } = useGlobalAccountError();

const goToHome = () => {
  clearError();
  router.push("/");
};
</script>

<style scoped>
.account-error {
  text-align: center;
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.account-error h2 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.account-error p {
  margin-bottom: 1rem;
  color: #666;
}

.account-error button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.account-error button:hover {
  background: #0056b3;
}
</style>
