<template>
  <Page :title="t('accounts.add')">
    <CustomerForm />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";

import CustomerForm from "./Customerform.vue";
import { useTranslations } from "../../index";

const messages = useTranslations();
const { t } = useI18n({ messages });
</script>
