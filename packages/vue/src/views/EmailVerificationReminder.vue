<template>
  <Page
    :title="t('user.emailVerification.title')"
    class="auth verify-email-reminder"
  >
    <Card>
      <p>{{ t("user.emailVerification.messages.verifyEmail") }}</p>

      <template #footer>
        <ButtonElement
          :label="t('user.emailVerification.button.label')"
          @click="handleResend"
        />
      </template>
    </Card>
  </Page>
</template>

<script lang="ts">
export default {
  name: "EmailVerificationReminder",
};
</script>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { ButtonElement, Card, Page } from "@dzangolab/vue3-ui";

import { EMAIL_VERIFICATION } from "../constant";
import { useTranslations, emitter } from "../index";
import { resendVerificationEmail } from "../supertokens";

const messages = useTranslations();

const { t } = useI18n({ messages });

const handleResend = () => {
  resendVerificationEmail()
    .then((status) => {
      if (status === EMAIL_VERIFICATION.OK) {
        emitter.emit("notify", {
          text: t("user.emailVerification.messages.resend.success"),
          type: "success",
        });
      } else if (status === EMAIL_VERIFICATION.EMAIL_ALREADY_VERIFIED_ERROR) {
        emitter.emit("notify", {
          text: t("user.emailVerification.messages.resend.alreadyVerified"),
          type: "info",
        });
      }
    })
    .catch(() => {
      emitter.emit("notify", {
        text: t("user.emailVerification.messages.resend.error"),
        type: "error",
      });
    });
};
</script>
