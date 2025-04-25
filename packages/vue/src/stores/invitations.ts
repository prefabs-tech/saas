import { defineStore } from "pinia";
import * as api from "../api/invitations";
import type { Invitation } from "../types";

export const useInvitationsStore = defineStore("invitations", () => {
  const acceptInvitation = async (token: string, apiBaseUrl: string) => {
    return await api.acceptInvitation(token, apiBaseUrl);
  };

  const createInvitation = async (
    data: Partial<Invitation>,
    apiBaseUrl: string
  ) => {
    return await api.createInvitation(data, apiBaseUrl);
  };

  const deleteInvitation = async (id: number, apiBaseUrl: string) => {
    return await api.deleteInvitation(id, apiBaseUrl);
  };

  const getAllInvitations = async (apiBaseUrl: string) => {
    return await api.getAllInvitations(apiBaseUrl);
  };

  const getInvitationById = async (id: number, apiBaseUrl: string) => {
    return await api.getInvitationById(id, apiBaseUrl);
  };

  const getInvitationByToken = async (token: string, apiBaseUrl: string) => {
    return await api.getInvitationByToken(token, apiBaseUrl);
  };

  const revokeInvitation = async (id: number, apiBaseUrl: string) => {
    return await api.revokeInvitation(id, apiBaseUrl);
  };

  return {
    acceptInvitation,
    createInvitation,
    deleteInvitation,
    getAllInvitations,
    getInvitationById,
    getInvitationByToken,
    revokeInvitation,
  };
});
