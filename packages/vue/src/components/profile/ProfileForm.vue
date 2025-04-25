<template>
  <Form ref="dzangolabVueUpdateProfile" class="profile-form" @submit="onSubmit">
    <Input
      v-model="formValues.givenName"
      :label="t('user.profile.form.firstName.label')"
      :placeholder="t('user.profile.form.firstName.placeholder')"
      name="givenName"
      type="text"
    />

    <Input
      v-model="formValues.surname"
      :label="t('user.profile.form.lastName.label')"
      :placeholder="t('user.profile.form.lastName.placeholder')"
      name="surname"
      type="text"
    />

    <FormActions
      :loading="loading || !isDirty"
      @cancel="dzangolabVueUpdateProfile.resetForm()"
    />
  </Form>
</template>

<script lang="ts">
export default {
  name: "ProfileForm",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { Input, Form, FormActions } from "@dzangolab/vue3-form";
import { useI18n } from "@dzangolab/vue3-i18n";
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";

import { updateUserProfile } from "../../api/user";
import { emitter, useTranslations } from "../../index";
import useUserStore from "../../store";

import type { UpdateProfileInputType } from "../../types";

const config = useConfig();

const messages = useTranslations();
const { t } = useI18n({ messages });

const userStore = useUserStore();
const setUser = userStore.setUser;
const { user } = storeToRefs(userStore);

const formValues = reactive({
  givenName: user.value?.givenName || "",
  surname: user.value?.surname || "",
});

const dzangolabVueUpdateProfile = ref();
const loading = ref<boolean>(false);

const isDirty = computed(() => {
  return (
    formValues.givenName !== user.value?.givenName ||
    formValues.surname !== user.value?.surname
  );
});

const onSubmit = async (data: UpdateProfileInputType) => {
  loading.value = true;

  updateUserProfile(data, config.apiBaseUrl)
    .then((response) => {
      if ("data" in response) {
        emitter.emit("notify", {
          text: t("user.profile.form.messages.success"),
          type: "success",
        });

        setUser(response.data);
      } else {
        emitter.emit("notify", {
          text: t("user.profile.form.messages.error"),
          type: "error",
        });
      }
    })
    .catch(() => {
      emitter.emit("notify", {
        text: t("user.profile.form.messages.error"),
        type: "error",
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
