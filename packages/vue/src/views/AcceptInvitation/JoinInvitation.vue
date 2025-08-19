<template>
  <Page
    class="join-invitation"
    :title="t('account.joinInvitation.title')"
    :centered="true"
  >
    <!-- TODO: Add the join invitation form -->
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page } from "@prefabs.tech/vue3-ui";

import { useTranslations } from "../../index";

const messages = useTranslations();
const { t } = useI18n({ messages });
</script>

<style lang="css">
.join-invitation {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
</style>
