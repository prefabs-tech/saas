import client from "./axios";
import type {
  AcceptInvitationResponse,
  AccountInvitation,
  AccountInvitationCreateInput,
  AddAccountInvitationResponse,
  DeleteAccountInvitationResponse,
  GetAccountInvitationsResponse,
  GetInvitationResponse,
  ResendAccountInvitationResponse,
  RevokeAccountInvitationResponse,
} from "../types/accountInvitation";

export const addInvitation = async (
  accountId: string,
  data: AccountInvitationCreateInput,
  apiBaseUrl: string
): Promise<AddAccountInvitationResponse> => {
  const response = await client(apiBaseUrl).post(
    `/accounts/${accountId}/invitations`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const deleteInvitation = async (
  accountId: string,
  id: number,
  apiBaseUrl: string
): Promise<DeleteAccountInvitationResponse> => {
  const response = await client(apiBaseUrl).delete(
    `/accounts/${accountId}/invitations/${id}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getInvitation = async (
  accountId: string,
  id: number,
  apiBaseUrl: string
): Promise<GetInvitationResponse> => {
  const response = await client(apiBaseUrl).get(
    `/accounts/${accountId}/invitations/${id}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getInvitations = async (
  accountId: string,
  apiBaseUrl: string,
  params?: object
): Promise<GetAccountInvitationsResponse> => {
  const response = await client(apiBaseUrl).get(
    `/accounts/${accountId}/invitations`,
    {
      params,
      withCredentials: true,
    }
  );

  return response.data;
};

export const joinInvitation = async (
  token: string,
  accountId: string | null,
  apiBaseUrl: string
): Promise<AccountInvitation> => {
  const response = await client(apiBaseUrl).post(
    `/accounts/${accountId}/invitations/join/${token}`,
    null,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const resendInvitation = async (
  accountId: string,
  id: number,
  apiBaseUrl: string
): Promise<ResendAccountInvitationResponse> => {
  const response = await client(apiBaseUrl).post(
    `/accounts/${accountId}/invitations/${id}/resend`,
    null,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const revokeInvitation = async (
  accountId: string,
  id: number,
  apiBaseUrl: string
): Promise<RevokeAccountInvitationResponse> => {
  const response = await client(apiBaseUrl).post(
    `/accounts/${accountId}/invitations/${id}/revoke`,
    null,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const signupInvitation = async (
  token: string,
  data: {
    email: string;
    givenName?: string;
    middleNames?: string;
    password: string;
    surname?: string;
  },
  accountId: string | null | undefined,
  apiBaseUrl: string
): Promise<AcceptInvitationResponse> => {
  const url = accountId
    ? `/accounts/${accountId}/invitations/token/${token}`
    : `/invitations/token/${token}`;

  const response = await client(apiBaseUrl).post(url, data, {
    withCredentials: false,
  });

  return response.data;
};
