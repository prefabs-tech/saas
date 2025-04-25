<template>
  <Page :title="t('user.profile.title')" class="profile">
    <AccountInfo />
    <ProfileForm />
  </Page>
</template>

<script lang="ts">
export default {
  name: "Profile",
};
</script>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { Page } from "@dzangolab/vue3-ui";

import AccountInfo from "../components/profile/AccountInfo.vue";
import ProfileForm from "../components/profile/ProfileForm.vue";
import { useTranslations } from "../index";

const messages = useTranslations();

const { t } = useI18n({ messages });
</script>

<style lang="css">
.page.profile > main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 0;
}

.profile .account-info {
  margin-bottom: 1rem;
}
</style>
