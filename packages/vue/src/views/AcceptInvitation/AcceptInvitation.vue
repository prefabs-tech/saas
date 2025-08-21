<template>
  <div class="accept-invitation">
    <LoadingIcon v-if="loading || !invitation" />
  </div>
</template>

<script setup lang="ts">
import { useConfig } from "@prefabs.tech/vue3-config";
import { LoadingIcon } from "@prefabs.tech/vue3-ui";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import useInvitationStore from "../../stores/accountInvitations";

import type { AccountInvitation } from "../../types/accountInvitation";
import type { AppConfig } from "@prefabs.tech/vue3-config";

const config = useConfig() as AppConfig;
const route = useRoute();
const router = useRouter();

const invitationStore = useInvitationStore();
const { getInvitationByToken } = invitationStore;

const token = route.params.token as string;
const accountId = route.query.accountId as string | undefined;

const invitation = ref<AccountInvitation | null>(null);
const loading = ref(true);

onMounted(async () => {
  if (token) {
    await fetchInvitation();
  }
});

async function fetchInvitation() {
  try {
    loading.value = true;
    const response = await getInvitationByToken(
      token,
      accountId || null,
      config.apiBaseUrl
    );
    invitation.value = response;

    // Redirect based on whether user exists (matching React logic exactly)
    if (invitation.value) {
      if (invitation.value.userId) {
        // For existing users, redirect to join invitation page
        // Vue Router's authentication framework will handle auth checks and redirects
        router.replace({
          name: "invitationJoin",
          params: { token: token },
          query: { accountId: accountId },
        });
      } else {
        // For new users, redirect to signup invitation page
        router.replace({
          name: "invitationSignup",
          params: { token: token },
          query: { accountId: accountId },
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch invitation:", error);
    loading.value = false;
  }
}
</script>

<style lang="css">
.accept-invitation {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
