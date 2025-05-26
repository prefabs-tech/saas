import { defineStore } from "pinia";

import { getUsers } from "../api/accountUsers";

const useUsersStore = defineStore("users", () => {
  return {
    getUsers,
  };
});

export default useUsersStore;
