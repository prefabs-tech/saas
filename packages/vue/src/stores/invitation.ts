import { defineStore } from "pinia";

import {
  addInvitation,
  deleteInvitation,
  getInvitation,
  getInvitations,
  joinInvitation,
  resendInvitation,
  revokeInvitation,
  signupInvitation,
} from "../api/invitation";

import type { AccountInvitationCreateInput } from "../types/accountInvitation";

const useInvitationStore = defineStore("invitation", () => {
  return {
    addInvitation,
    deleteInvitation,
    getInvitation,
    getInvitations,
    joinInvitation,
    resendInvitation,
    revokeInvitation,
    signupInvitation,
  };
});

export default useInvitationStore;
