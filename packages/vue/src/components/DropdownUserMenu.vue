<template>
  <nav
    ref="dzangolabVueUserUserMenu"
    class="user-menu-dropdown"
    :class="{ expanded: expanded }"
    @click="toggle"
  >
    <div class="trigger">
      <span class="email">
        {{ user?.email }}
      </span>
      <span class="toggle">
        <svg
          aria-label="open user menu"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"
            fill="currentColor"
          ></path>
        </svg>
      </span>
    </div>
    <ul class="dropdown">
      <li>
        <router-link :to="{ name: 'changePassword' }">
          {{ $t("app.header.menu.changePassword") }}
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'profile' }">
          {{ $t("app.header.menu.profile") }}
        </router-link>
      </li>
      <li class="option" @click="$emit('logout')">
        {{ $t("app.header.menu.logout") }}
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
export default {
  name: "DropdownUserMenu",
};
</script>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

import type { User } from "../types";
import type { PropType } from "vue";

const expanded = ref(false);

defineEmits(["logout"]);

defineProps({
  user: {
    required: true,
    type: Object as PropType<User>,
  },
});

const toggle = () => {
  expanded.value = !expanded.value;
};

const dzangolabVueUserUserMenu = ref(null);

onClickOutside(dzangolabVueUserUserMenu, (event) => {
  expanded.value = false;
});
</script>

<style lang="css">
nav.user-menu-dropdown {
  cursor: pointer;
  min-width: var(--dropdown-width, 6rem);
  padding: 0;
  position: relative;
}

nav.user-menu-dropdown .email {
  cursor: pointer;
  max-width: 13rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

nav.user-menu-dropdown > .trigger {
  --_padding-h: var(--layout-nav-item-paddind-h, 1rem);
  --_padding-v: var(--layout-nav-item-paddind-v, 0.625rem);

  align-items: flex-start;
  display: flex;
  flex-direction: row;
  gap: 0;
  justify-content: space-between;
  padding: var(--_padding-v) var(--_padding-h);
}

nav.user-menu-dropdown span.toggle {
  align-self: center;
  display: block;
  font-size: 1.5rem;
  line-height: 1.25rem;
  text-align: center;
  width: 1.25rem;
}

nav.user-menu-dropdown.expanded,
nav.user-menu-dropdown:hover {
  background-color: var(--dropdown-container-bg-color, #e5e5e5);
  border-radius: 5px;
}

nav.user-menu-dropdown.expanded span.toggle > svg {
  transform: rotate(0);
}

nav.user-menu-dropdown span.toggle > svg {
  transform: rotate(-180deg);
  transition: transform 0.5s ease;
}

nav.user-menu-dropdown > ul.dropdown {
  background-color: var(--dropdown-bg-color, #fff);
  border: var(--dropdown-border, 1px solid grey);
  border-radius: var(--dropdown-border-radius, 5px);
  inset: 0px auto auto 0px;
  list-style: none;
  max-height: 0;
  padding: 0.15rem 0;
  padding-inline-start: 0;
  position: absolute;
  transform: translate3d(0, 48.5px, 0px);
  transition: max-height 0.4s ease;
  visibility: hidden;
  z-index: var(--dropdown-z-index, 9999);
}

nav.user-menu-dropdown.expanded > ul.dropdown {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  height: auto;
  max-height: 10rem;
  overflow-y: hidden;
  visibility: visible;
}

nav.user-menu-dropdown > ul.dropdown > li {
  cursor: pointer;
  transition: all var(--transition-duration) ease 0s;
}

nav.user-menu-dropdown > .dropdown > li:hover,
nav.user-menu > ul > li:has(.router-link-exact-active) {
  background-color: var(--dropdown-bg-color-hover, #e5e5e5);
}

nav.user-menu-dropdown > ul.dropdown > li > a,
nav.user-menu-dropdown > ul.dropdown > li:not(:has(a)) {
  color: inherit;
  display: block;
  padding: 0.7rem 1.25rem;
  text-decoration: none;
  width: 100%;
}
</style>
