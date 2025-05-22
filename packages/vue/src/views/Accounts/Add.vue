<template>
  <Page :title="t('accounts.add')">
    <AccountForm @submit="onSubmit" @cancel="onCancel" />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { useRouter } from "vue-router";

import AccountForm from "./_components/Accountform.vue";
import { useTranslations } from "../../index";

const messages = useTranslations();
const { t } = useI18n({ messages });
const router = useRouter();

const onCancel = () => {
  router.push({ name: "accounts" });
};

const onSubmit = () => {
  router.push({ name: "accounts" });
};
</script>
