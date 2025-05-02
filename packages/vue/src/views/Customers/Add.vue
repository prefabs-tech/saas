<template>
  <Page :title="t('customers.add')">
    <CustomerForm @submit="onSubmit" @cancel="onCancel" />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { useRouter } from "vue-router";

import CustomerForm from "./Customerform.vue";
import { useTranslations } from "../../index";

const messages = useTranslations();
const { t } = useI18n({ messages });
const router = useRouter();

const onCancel = () => {
  router.push({ name: "customers" });
};

const onSubmit = () => {
  router.push({ name: "customers" });
};
</script>
