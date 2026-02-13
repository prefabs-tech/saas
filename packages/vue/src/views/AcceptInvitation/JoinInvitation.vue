<template>
  <Page
    :title="
      error || isInvalidInvitation ? '' : t('account.joinInvitation.title')
    "
    :loading="invitationLoading || !invitation"
    :centered="true"
    class="join-invitation"
  >
    <div v-if="error" class="error-message">
      <p>{{ t("account.joinInvitation.messages.errorFetching") }}</p>
    </div>

    <div v-else-if="isInvalidInvitation" class="error-message">
      <p>{{ t("account.joinInvitation.messages.invalid") }}</p>
    </div>

    <div v-else class="invitation-content">
      <p class="info">
        {{
          t("account.joinInvitation.info", {
            account: invitation?.account?.name || "",
          })
        }}
      </p>
      <div class="actions">
        <ButtonElement
          :label="t('account.joinInvitation.actions.accept')"
          :loading="loading"
          @click="handleSubmit"
        />
        <ButtonElement
          :label="t('account.joinInvitation.actions.ignore')"
          :disabled="loading"
          severity="secondary"
          variant="outlined"
          @click="handleIgnore"
        />
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { ButtonElement, Page } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

import { REDIRECT_AFTER_LOGIN_KEY } from "../../constant";
import { useTranslations } from "../../index";
import useInvitationStore from "../../stores/AccountInvitations";

import type { AccountInvitation } from "../../types/AccountInvitation";
import type { SaasEventHandlers, EventMessage } from "../../types/plugin";
import type { AppConfig } from "@prefabs.tech/vue3-config";

export interface JoinInvitationProperties {
  centered?: boolean;
}

withDefaults(defineProps<JoinInvitationProperties>(), {
  centered: true,
});

const config = useConfig() as AppConfig;
const route = useRoute();
const router = useRouter();

const invitationStore = useInvitationStore();
const { getInvitationByToken, joinInvitation } = invitationStore;

const messages = useTranslations();
const { t } = useI18n({ messages });

const eventHandlers = inject<SaasEventHandlers>(
  Symbol.for("saas.eventHandlers"),
  { notification: undefined },
);

const token = route.params.token as string;
const accountId = route.query.accountId as string | undefined;

const invitation = ref<AccountInvitation | null>(null);
const invitationLoading = ref(true);
const loading = ref(false);
const error = ref(false);

const isInvalidInvitation = computed(() => {
  return (
    invitation.value?.acceptedAt ||
    invitation.value?.revokedAt ||
    (invitation.value?.expiresAt && invitation.value.expiresAt < Date.now())
  );
});

onMounted(async () => {
  if (token) {
    await fetchInvitation();
  }

  sessionStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);
});

async function fetchInvitation() {
  try {
    invitationLoading.value = true;
    error.value = false;

    const response = await getInvitationByToken(
      token,
      accountId || null,
      config.apiBaseUrl,
    );

    invitation.value = response;
  } catch (error_) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch invitation:", error_);

    error.value = true;
  } finally {
    invitationLoading.value = false;
  }
}

async function handleSubmit() {
  if (!token) {
    return;
  }

  try {
    loading.value = true;
    await joinInvitation(token, accountId || null, config.apiBaseUrl);

    const message: EventMessage = {
      type: "success",
      message: t("account.joinInvitation.messages.success"),
      details: {
        invitation: invitation.value,
      },
    };

    eventHandlers?.notification?.(message);

    // Navigate to home or dashboard
    router.push("/");
  } catch (error_) {
    // eslint-disable-next-line no-console
    console.error("Failed to join invitation:", error_);

    const message: EventMessage = {
      type: "error",
      message: t("account.joinInvitation.messages.error"),
    };

    eventHandlers?.notification?.(message);
  } finally {
    loading.value = false;
  }
}

function handleIgnore() {
  router.push("/");
}
</script>

<style lang="css">
.join-invitation {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.invitation-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
}

.info {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.error-message {
  text-align: center;
}
</style>
