<template>
  <Page :title="t('user.emailVerification.title')" class="auth verify-email">
    <Card>
      <p>{{ message }}</p>

      <template
        v-if="
          status === EMAIL_VERIFICATION.EMAIL_VERIFICATION_INVALID_TOKEN_ERROR
        "
        #footer
      >
        <ButtonElement
          :label="t('user.emailVerification.button.label')"
          @click="handleResend"
        />
      </template>
    </Card>

    <LoadingPage :loading="loading" />
  </Page>
</template>

<script lang="ts">
export default {
  name: "VerifyEmail",
};
</script>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { ButtonElement, Card, LoadingPage, Page } from "@dzangolab/vue3-ui";
import { computed, onMounted, ref } from "vue";

import { EMAIL_VERIFICATION } from "../constant";
import { useTranslations, emitter } from "../index";
import useUserStore from "../store";
import { resendVerificationEmail, verifyEmail } from "../supertokens";

const messages = useTranslations();

const { t } = useI18n({ messages });

const { user } = useUserStore();

const loading = ref<boolean>(false);
const status = ref<string>();

const message = computed(() => {
  if (loading.value) {
    return t("user.emailVerification.messages.verifyingEmail");
  }

  let message = "";

  switch (status.value) {
    case EMAIL_VERIFICATION.OK:
      message = t("user.emailVerification.messages.verify.success");
      break;
    case EMAIL_VERIFICATION.EMAIL_ALREADY_VERIFIED:
      message = t("user.emailVerification.messages.resend.alreadyVerified");
      break;
    case EMAIL_VERIFICATION.EMAIL_VERIFICATION_INVALID_TOKEN_ERROR:
      message = t("user.emailVerification.messages.verify.invalidToken");
      break;
    default:
      message = t("user.emailVerification.messages.resend.error");
  }

  return message;
});

onMounted(() => {
  if (user) {
    loading.value = true;

    verifyEmail()
      .then((response) => {
        status.value = response.status;

        if (status.value === EMAIL_VERIFICATION.OK) {
          emitter.emit("notify", {
            text: t("user.emailVerification.messages.verify.success"),
            type: "success",
          });
        } else if (
          status.value === EMAIL_VERIFICATION.EMAIL_ALREADY_VERIFIED_ERROR
        ) {
          emitter.emit("notify", {
            text: t("user.emailVerification.messages.verify.alreadyVerified"),
            type: "info",
          });
        } else {
          emitter.emit("notify", {
            text: t("user.emailVerification.messages.verify.invalidToken"),
            type: "error",
          });
        }
      })
      .catch(() => {
        emitter.emit("notify", {
          text: t("user.emailVerification.messages.resend.error"),
          type: "error",
        });
      })
      .finally(() => {
        loading.value = false;
      });
  }
});

const handleResend = () => {
  resendVerificationEmail()
    .then((verificationStatus) => {
      if (verificationStatus === EMAIL_VERIFICATION.OK) {
        emitter.emit("notify", {
          text: t("user.emailVerification.messages.resend.success"),
          type: "success",
        });
      } else if (
        verificationStatus === EMAIL_VERIFICATION.EMAIL_ALREADY_VERIFIED_ERROR
      ) {
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
