<template>
  <Layout
    :menu="menu"
    :no-locale-switcher="noLocaleSwitcher"
    :user-menu-location="userMenuLocation"
  >
    <template #header>
      <slot name="header"></slot>
    </template>

    <template #locales>
      <slot name="locales"></slot>
    </template>

    <template #userMenu>
      <UserMenu v-if="showUserMenu" />
    </template>

    <template #afterNavLinks>
      <slot name="afterNavLinks"></slot>
    </template>

    <template #afterSidebarMenu>
      <slot name="afterSidebarMenu"></slot>
    </template>

    <template #footer>
      <slot name="footer"></slot>
    </template>

    <slot></slot>
  </Layout>
</template>

<script lang="ts">
export default {
  name: "SidebarHeaderLayout",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { SidebarHeaderLayout as Layout } from "@dzangolab/vue3-layout";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";

import UserMenu from "../components/UserMenu.vue";
import useUserStore from "../store";

import type { MenuItem, SidebarMenu } from "@dzangolab/vue3-layout";

defineProps({
  noLocaleSwitcher: Boolean,
  showUserMenu: {
    default: true,
    required: false,
    type: Boolean,
  },
  userMenuLocation: {
    default: "sidebar",
    type: String,
    validator: (value: string) => ["header", "sidebar"].includes(value),
  },
});

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const { layout: layoutConfig } = useConfig();

const router = useRouter();

const allRoutes = router.getRoutes();

const menu = computed(() => {
  let menuItems = layoutConfig?.mainMenu || [];

  if (!user.value) {
    menuItems = menuItems?.filter((item: MenuItem) => {
      const route = allRoutes.find((r) => {
        if (r.name === item.route && !r.meta?.authenticated) {
          return true;
        }

        if (item.children?.length) {
          return (item.children as MenuItem[]).some((child: MenuItem) => {
            return allRoutes.some(
              (cr) => cr.name === child.route && !cr.meta?.authenticated,
            );
          });
        }

        return false;
      });

      return !!route;
    }) as MenuItem[];
  }

  return menuItems.map((item: MenuItem) => {
    return {
      hide: item?.hide,
      icon: item?.icon,
      name: item.name,
      routeName: item.route,
      shortName: item?.shortName,
      children: item?.children?.map((childItem: MenuItem) => {
        return {
          hide: childItem?.hide,
          icon: childItem?.icon,
          name: childItem.name,
          routeName: childItem.route,
          shortName: childItem?.shortName,
        };
      }),
    };
  }) as SidebarMenu[];
});
</script>

<style lang="css">
.sidebar-header-layout > .sidebar .user-menu > ul {
  flex-direction: column;
}

.sidebar-header-layout > .sidebar .user-menu > ul > li,
.sidebar-header-layout > .sidebar .user-menu-dropdown {
  --_font-size: var(--font-size-min, 0.8rem);
  --_font-weight: var(--font-weight, 450);
  --dropdown-container-bg-color: #0870e5;
  --menu-highlight-color: #0870e5;

  font-size: var(--_font-size);
  font-weight: var(--_font-weight);
  width: 100%;
}

.sidebar-header-layout
  > .sidebar
  .user-menu
  > ul
  > li:has(.router-link-exact-active) {
  background-color: #0870e5;
}

.sidebar-header- > .sidebar .user-menu:not(.user-menu-dropdown) > ul > li > a,
.sidebar-header-layout > .sidebar .user-menu-dropdown,
.sidebar-header-layout > .sidebar .user-menu-dropdown > ul.dropdown > li {
  --_height: var(--nav-menu-height, 3rem);

  align-items: center;
  display: flex;
  height: var(--_height);
  width: 100%;
}

.sidebar-header-layout > .sidebar .user-menu-dropdown:hover {
  background-color: #0870e5;
}

.sidebar-header-layout > .sidebar .user-menu-dropdown.expanded > ul > li:hover {
  --dropdown-bg-color-hover: #0870e5;
}

.sidebar-header-layout > .sidebar .user-menu-dropdown.expanded .toggle > svg {
  transform: rotate(-180deg);
}

.sidebar-header-layout > .sidebar .user-menu-dropdown .toggle > svg {
  transform: rotate(0);
}

.sidebar-header-layout > .sidebar .user-menu-dropdown > .dropdown {
  opacity: 0;
  transform: translate3d(0, 0, 0);
  transition:
    transform 0.3s ease,
    opacity 0.5s ease;
}

.sidebar-header-layout > .sidebar .user-menu-dropdown.expanded > .dropdown {
  --dropdown-bg-color: #007aff;
  --dropdown-border: 1px solid #007aff;

  box-shadow: 0 -2px 10px 2px #0870e5;
  opacity: 1;
  transform: translate3d(0, -152.5px, 0);
  width: 100%;
}
</style>
