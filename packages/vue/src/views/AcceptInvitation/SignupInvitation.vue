<template>
  <Page
    class="signup-invitation"
    :title="t('account.signup.title.user')"
    :loading="invitationLoading || !invitation"
    :centered="true"
  >
    <div v-if="error" class="error-message">
      <p>{{ t("account.signupInvitation.messages.errorFetching") }}</p>
    </div>

    <div v-else-if="isInvalidInvitation" class="error-message">
      <p>{{ t("account.signupInvitation.messages.invalid") }}</p>
    </div>

    <div v-else class="invitation-content">
      <UserSignupForm
        :email="invitation?.email || ''"
        :loading="loading"
        @submit="handleSubmit"
      />
    </div>
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

import UserSignupForm from "../../components/UserSignupForm.vue";
import { useTranslations } from "../../index";
import useInvitationStore from "../../stores/accountInvitations";

import type { AccountInvitation } from "../../types/accountInvitation";
import type { SaasEventHandlers } from "../../types/plugin";
import type { UserSignupData } from "../../types/user";
import type { AppConfig } from "@prefabs.tech/vue3-config";

export interface SignupInvitationProperties {
  centered?: boolean;
}

withDefaults(defineProps<SignupInvitationProperties>(), {
  centered: true,
});

const config = useConfig() as AppConfig;
const route = useRoute();
const router = useRouter();

const invitationStore = useInvitationStore();
const { getInvitationByToken, signupInvitation } = invitationStore;

const messages = useTranslations();
const { t } = useI18n({ messages });

const __saasEventHandlers = Symbol.for("saas.eventHandlers");
const eventHandlers = inject<SaasEventHandlers>(__saasEventHandlers);

const token = route.params.token as string;
const accountId = route.query.accountId as string | undefined;

const invitation = ref<AccountInvitation | null>(null);
const invitationLoading = ref(true);
const loading = ref(false);
const error = ref(false);

const isInvalidInvitation = computed(() => {
  if (!invitation.value) {
    return false;
  }

  return (
    invitation.value.acceptedAt ||
    invitation.value.revokedAt ||
    (invitation.value.expiresAt && invitation.value.expiresAt < Date.now())
  );
});

onMounted(async () => {
  if (token) {
    await fetchInvitation();
  }
});

async function fetchInvitation() {
  try {
    invitationLoading.value = true;
    error.value = false;
    const response = await getInvitationByToken(
      token,
      accountId || null,
      config.apiBaseUrl
    );
    invitation.value = response;
  } catch {
    error.value = true;
  } finally {
    invitationLoading.value = false;
  }
}

async function handleSubmit(userData: UserSignupData) {
  if (!token) {
    return;
  }

  try {
    loading.value = true;
    await signupInvitation(
      token,
      userData,
      accountId || null,
      config.apiBaseUrl
    );

    // Show success notification
    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "success",
        message: t("account.signupInvitation.messages.success"),
      });
    }

    // Navigate to home or login page
    router.push("/auth/signin");
  } catch (error) {
    // Log error for debugging
    // eslint-disable-next-line no-console
    console.error("Signup failed:", error);
    // Show error notification
    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "error",
        message: t("account.signupInvitation.messages.error"),
      });
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="css">
.signup-invitation {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.signup-invitation .error-message {
  text-align: center;
  color: var(--error-color, #dc3545);
  margin-bottom: 1rem;
}

.signup-invitation .invitation-content {
  width: 100%;
}
</style>
