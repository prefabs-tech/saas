<template>
  <Page :title="t('user.signup.title')" class="auth signup">
    <Errors v-if="errors.length" :errors="errors" />

    <slot name="instructions"></slot>

    <Card v-if="!invitation || invalidInvitation">
      <p>
        {{
          t(
            `user.invitation.messages.invite.${invitation ? "invalidInvitation" : "errorFetchingInvitation"}`,
          )
        }}
      </p>
    </Card>

    <SignupForm v-else @submit="handleSubmit" />
  </Page>
</template>

<script lang="ts">
export default {
  name: "AcceptInvitation",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Card, Errors, Page } from "@dzangolab/vue3-ui";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import SignupForm from "../components/SignupForm.vue";
import { useTranslations, emitter } from "../index";
import useUserStore from "../store";

import type { LoginCredentials } from "../types";
import type { AppConfig } from "@dzangolab/vue3-config";
import type { Error as ErrorType } from "@dzangolab/vue3-ui";
import type { Ref } from "vue";

const config = useConfig() as AppConfig;

const messages = useTranslations();

const { t } = useI18n({ messages });

const userStore = useUserStore();
const {
  acceptInvitation,
  getInvitationByToken,
  login,
  setInvitation,
  setUser,
} = userStore;
const { invitation } = storeToRefs(userStore);

const route = useRoute();
const router = useRouter();
const token = route.params?.token as string;

const errors = ref([]) as Ref<ErrorType[]>;

const invalidInvitation = computed(() => {
  return (
    invitation.value?.acceptedAt ||
    invitation.value?.revokedAt ||
    (invitation.value?.expiresAt ?? 0) < Date.now()
  );
});

const handleSubmit = async (credentials: LoginCredentials) => {
  if (!token) {
    return;
  }

  await acceptInvitation(token, credentials, config?.apiBaseUrl).then(
    async (response) => {
      if ("data" in response && response.data.status === "ERROR") {
        emitter.emit("notify", {
          text: response.data.message,
          type: "error",
        });
      } else {
        await login(credentials)
          .then(async (response) => {
            if (response) {
              setUser(response);

              router.push({ name: "home" });

              emitter.emit("notify", {
                text: t("user.login.messages.success"),
                type: "success",
              });
            }
          })
          .catch((error) => {
            errors.value = [
              {
                code: error.message,
                message: t(`user.login.errors.${error.message}`),
              },
            ];

            emitter.emit("notify", {
              text: error.message,
              type: "error",
            });
          });
      }
    },
  );
};

const prepareComponent = async () => {
  if (token) {
    await getInvitationByToken(token, config?.apiBaseUrl).then((response) => {
      setInvitation(response);
    });
  }
};

prepareComponent();
</script>
