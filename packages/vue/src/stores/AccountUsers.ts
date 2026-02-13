import { defineStore } from "pinia";

import { getUsers, enableUser, disableUser } from "../api/AccountUsers";

const useUsersStore = defineStore("users", () => {
  return {
    disableUser,
    enableUser,
    getUsers,
  };
});

export default useUsersStore;
