import { defineStore } from "pinia";

import { getUsers, enableUser, disableUser } from "../api/accountUsers";

const useUsersStore = defineStore("users", () => {
  return {
    disableUser,
    enableUser,
    getUsers,
  };
});

export default useUsersStore;
