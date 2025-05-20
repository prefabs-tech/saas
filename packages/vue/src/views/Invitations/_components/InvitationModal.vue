<template>
  <Modal
    :show="show"
    :title="t('customers.invitations.modal.title')"
    @on:close="$emit('close')"
  >
    <InvitationForm
      :loading="loading"
      @submit="handleSubmit"
      @cancel="$emit('close')"
    />
  </Modal>
</template>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { Modal } from "@dzangolab/vue3-ui";

import InvitationForm from "./InvitationForm.vue";
import { useTranslations } from "../../../index";

defineProps({
  show: Boolean,
  loading: Boolean,
});

const emit = defineEmits(["close", "created"]);

const messages = useTranslations();
const { t } = useI18n({ messages, locale: "en" });

const handleSubmit = async () => {
  try {
    emit("created");
  } catch (error) {
    console.error("Failed to create invitation:", error);
  }
};
</script>
