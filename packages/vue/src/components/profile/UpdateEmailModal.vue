<template>
  <Modal
    class="update-email-modal"
    :show="show"
    :title="t('user.profile.accountInfo.title')"
    @on:close="$emit('on:close')"
  >
    <UpdateEmailForm @email:update-processed="$emit('on:close')" />
  </Modal>
</template>

<script lang="ts">
export default {
  name: "UpdateEmailModal",
};
</script>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { Modal } from "@dzangolab/vue3-ui";

import UpdateEmailForm from "./UpdateEmailForm.vue";
import { useTranslations } from "../../index";

const messages = useTranslations();
const { t } = useI18n({ messages });

defineProps({
  show: {
    default: false,
    type: Boolean,
  },
});

defineEmits(["on:close"]);
</script>
