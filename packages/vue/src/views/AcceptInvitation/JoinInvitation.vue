<template>
  <Page
    class="join-invitation"
    :title="t('account.joinInvitation.title')"
    :loading="invitationLoading || !invitation"
    :centered="centered"
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
          class="accept-button"
          @click="handleSubmit"
        />

        <ButtonElement
          variant="outlined"
          severity="secondary"
          class="ignore-button"
          :disabled="loading"
          :label="t('account.joinInvitation.actions.ignore')"
          @click="handleIgnore"
        />
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page, ButtonElement } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useTranslations } from "../../index";
import useInvitationStore from "../../stores/accountInvitations";

import type { AccountInvitation } from "../../types/accountInvitation";
import type { SaasEventHandlers } from "../../types/plugin";
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

async function handleSubmit() {
  if (!token) {
    return;
  }

  try {
    loading.value = true;
    await joinInvitation(token, accountId || null, config.apiBaseUrl);

    // Show success notification
    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "success",
        message: t("account.joinInvitation.messages.success"),
      });
    }

    // Navigate to home or wherever appropriate
    router.push("/");
  } catch {
    // Show error notification
    if (eventHandlers?.notification) {
      eventHandlers.notification({
        type: "error",
        message: t("account.joinInvitation.messages.error"),
      });
    }
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
  max-width: 400px;
  margin: 0 auto;
}

.join-invitation .error-message {
  text-align: center;
  color: var(--error-color, #dc3545);
  margin-bottom: 1rem;
}

.join-invitation .invitation-content {
  text-align: center;
}

.join-invitation .info {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.5;
}

.join-invitation .actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.join-invitation .accept-button {
  order: 1;
}

.join-invitation .ignore-button {
  order: 2;
}

@media (min-width: 768px) {
  .join-invitation .actions {
    flex-direction: row;
    justify-content: center;
  }

  .join-invitation .accept-button {
    order: 1;
  }

  .join-invitation .ignore-button {
    order: 2;
  }
}
</style>
