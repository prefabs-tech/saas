import { defineStore } from "pinia";

import {
  addInvitation,
  deleteInvitation,
  getInvitation,
  getInvitationByToken,
  getInvitations,
  joinInvitation,
  resendInvitation,
  revokeInvitation,
  signupInvitation,
} from "../api/accountInvitations";

import type { AccountInvitationCreateInput } from "../types/accountInvitation";

const useInvitationStore = defineStore("invitation", () => {
  return {
    addInvitation,
    deleteInvitation,
    getInvitation,
    getInvitationByToken,
    getInvitations,
    joinInvitation,
    resendInvitation,
    revokeInvitation,
    signupInvitation,
  };
});

export default useInvitationStore;
