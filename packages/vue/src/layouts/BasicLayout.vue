<template>
  <OriginalBasicLayout :no-locale-switcher="noLocaleSwitcher">
    <template #header>
      <AppHeader>
        <template #logo>
          <Logo :route="home" />
        </template>
        <template #addon>
          <slot name="addon" />
        </template>
        <template #menu>
          <MainMenu class="main-menu" :routes="routes" />
        </template>
        <template #userMenu>
          <UserMenu v-if="showUserMenu" />
        </template>
      </AppHeader>
    </template>

    <slot></slot>
  </OriginalBasicLayout>
</template>

<script lang="ts">
export default {
  name: "BasicLayout",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import {
  AppHeader,
  BasicLayout as OriginalBasicLayout,
  Logo,
  MainMenu,
} from "@dzangolab/vue3-layout";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";

import UserMenu from "../components/UserMenu.vue";
import useUserStore from "../store";

import type { MenuItem } from "@dzangolab/vue3-layout";

defineProps({
  noLocaleSwitcher: Boolean,
  showUserMenu: {
    default: true,
    required: false,
    type: Boolean,
  },
});

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const { layout: layoutConfig, user: userConfig } = useConfig();

const home = computed(() => {
  return user.value
    ? userConfig && userConfig?.routes?.home
      ? userConfig.routes.home
      : "profile"
    : layoutConfig && layoutConfig?.homeRoute
      ? layoutConfig.homeRoute
      : undefined;
});

const router = useRouter();

const allRoutes = router.getRoutes();

const routes = computed(() => {
  if (!user.value) {
    return layoutConfig?.mainMenu?.filter((item) => {
      const route = allRoutes.find((r) => r.name === item.route);

      return route && !route.meta?.authenticated;
    }) as MenuItem[];
  }

  return layoutConfig?.mainMenu as MenuItem[];
});
</script>
