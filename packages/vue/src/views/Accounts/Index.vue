<template>
  <div>
    <h1>{{ t("accounts.title") }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";

import { useTranslations } from "../../index";

const messages = useTranslations();

const { t } = useI18n({ messages });
</script>
