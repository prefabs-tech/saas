<template>
  <DropdownUserMenu
    v-if="user"
    class="user-menu"
    :user="user"
    @logout="handleLogout"
  />
  <SignInUpMenu v-else class="user-menu" />
</template>

<script lang="ts">
export default {
  name: "UserMenu",
};
</script>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import DropdownUserMenu from "./DropdownUserMenu.vue";
import SignInUpMenu from "./SignInUpMenu.vue";
import useUserStore from "../store";

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const { logout } = userStore;

const router = useRouter();

const handleLogout = async () => {
  await logout();

  router.push({ name: "login" });
};
</script>
