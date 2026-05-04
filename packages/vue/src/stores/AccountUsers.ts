import { defineStore } from "pinia";

import { disableUser, enableUser, getUsers } from "../api/AccountUsers";

const useUsersStore = defineStore("users", () => {
  return {
    disableUser,
    enableUser,
    getUsers,
  };
});

export default useUsersStore;
