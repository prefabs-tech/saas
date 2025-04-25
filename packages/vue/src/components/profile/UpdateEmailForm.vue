<template>
  <Form ref="dzangolabVueUpdateEmail" @submit="onSubmit">
    <Email
      v-model="email"
      :error-messages="errorMessages"
      :label="t('user.profile.accountInfo.newEmail')"
      name="email"
    />

    <FormActions
      :loading="loading || !isEmailDirty"
      @cancel="dzangolabVueUpdateEmail.resetForm()"
    />
  </Form>
</template>

<script lang="ts">
export default {
  name: "UpdateEmailForm",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { Email, Form, FormActions } from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { getMe } from "../../api/user";
import { emitter, useTranslations } from "../../index";
import useUserStore from "../../store";
import { changeEmail } from "../../supertokens";

type UpdateEmailFormData = {
  email: string;
};

const emit = defineEmits(["email:updateProcessed"]);

const config = useConfig();

const messages = useTranslations();
const { t } = useI18n({ messages });

const userStore = useUserStore();
const setUser = userStore.setUser;
const { user } = storeToRefs(userStore);

const errorMessages = {
  invalid: t("user.profile.accountInfo.messages.invalid"),
  required: t("user.profile.accountInfo.messages.email"),
};

const dzangolabVueUpdateEmail = ref();
const email = ref<string | undefined>(user.value?.email);
const loading = ref<boolean>(false);

const isEmailDirty = computed(() => {
  return user.value?.email !== email.value;
});

const onSubmit = async (data: UpdateEmailFormData) => {
  loading.value = true;

  try {
    const response = await changeEmail(data.email, config.apiBaseUrl);
    switch (response?.status) {
      case "OK": {
        const userInfo = await getMe(config.apiBaseUrl);
        const isSameEmail = userInfo.data.email === user.value?.email;

        if (config.user?.features?.signUp?.emailVerification && isSameEmail) {
          emitter.emit("notify", {
            text: t("user.profile.accountInfo.messages.emailSent"),
            type: "success",
          });
        } else {
          setUser(userInfo.data);
          emitter.emit("notify", {
            text: t("user.profile.accountInfo.messages.success"),
            type: "success",
          });
        }

        emit("email:updateProcessed");
        dzangolabVueUpdateEmail.value?.resetForm();
        break;
      }
      case "EMAIL_ALREADY_EXISTS_ERROR": {
        emitter.emit("notify", {
          text: t("user.profile.accountInfo.messages.alreadyExist"),
          type: "error",
        });
        break;
      }
      case "EMAIL_SAME_AS_CURRENT_ERROR": {
        emitter.emit("notify", {
          text: t("user.profile.accountInfo.messages.duplicate"),
          type: "error",
        });
        break;
      }
      case "EMAIL_INVALID_ERROR": {
        emitter.emit("notify", {
          text: t("user.profile.accountInfo.messages.invalid"),
          type: "error",
        });
        break;
      }
      case "EMAIL_FEATURE_DISABLED_ERROR": {
        emitter.emit("notify", {
          text: t("user.profile.accountInfo.messages.disabled"),
          type: "error",
        });
        break;
      }
      default: {
        emitter.emit("notify", {
          text: t("user.profile.accountInfo.messages.error"),
          type: "error",
        });
        break;
      }
    }

    loading.value = false;
  } catch (error) {
    emitter.emit("notify", {
      text: t("user.profile.accountInfo.messages.error"),
      type: "error",
    });

    loading.value = false;
  }
};
</script>
