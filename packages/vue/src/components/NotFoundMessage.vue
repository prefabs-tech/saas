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

import { useGlobalAccountError } from "../composables/UseGlobalAccountError";
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
  margin: 0 auto;
  max-width: 500px;
  padding: 2rem;
  text-align: center;
}

.account-error h2 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.account-error p {
  color: #666;
  margin-bottom: 1rem;
}

.account-error button {
  background: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
}

.account-error button:hover {
  background: #0056b3;
}
</style>
