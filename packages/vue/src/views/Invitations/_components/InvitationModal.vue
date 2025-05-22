<template>
  <Modal
    :show="show"
    :title="t('account.invitations.modal.title')"
    @on:close="$emit('close')"
  >
    <InvitationForm :loading="loading" @cancel="$emit('close')" />
  </Modal>
</template>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { Modal } from "@dzangolab/vue3-ui";

import InvitationForm from "./Form.vue";
import { useTranslations } from "../../../index";

defineProps({
  show: Boolean,
  loading: Boolean,
});

defineEmits(["close"]);

const messages = useTranslations();
const { t } = useI18n({ messages, locale: "en" });
</script>

<style lang="css">
.modal .dialog.active {
  min-width: 350px;
}

@media (min-width: 768px) {
  .modal .dialog.active {
    min-width: 500px;
  }
}
</style>
