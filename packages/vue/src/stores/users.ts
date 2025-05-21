import { defineStore } from "pinia";

import { getUsers } from "../api/users";

const useUsersStore = defineStore("users", () => {
  return {
    getUsers,
  };
});

export default useUsersStore;
