import { STATUS_ERROR } from "../constant";
import client, { encodeURIParameter } from "./axios";

import type { Invitation } from "../types";

const acceptInvitation = async (
  token: string,
  apiBaseUrl: string
): Promise<Invitation> => {
  const response = await client(apiBaseUrl).post(
    `/invitations/accept/${encodeURIParameter(token)}`,
    {},
    {
      withCredentials: true,
    }
  );

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

const createInvitation = async (
  data: Partial<Invitation>,
  apiBaseUrl: string
): Promise<Invitation> => {
  const response = await client(apiBaseUrl).post("/invitations", data, {
    withCredentials: true,
  });

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

const deleteInvitation = async (
  id: number,
  apiBaseUrl: string
): Promise<void> => {
  const response = await client(apiBaseUrl).delete(`/invitations/${id}`, {
    withCredentials: true,
  });

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  }
};

const getAllInvitations = async (apiBaseUrl: string): Promise<Invitation[]> => {
  const response = await client(apiBaseUrl).get("/invitations", {
    withCredentials: true,
  });

  return response.data;
};

const getInvitationById = async (
  id: number,
  apiBaseUrl: string
): Promise<Invitation> => {
  const response = await client(apiBaseUrl).get(`/invitations/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

const getInvitationByToken = async (
  token: string,
  apiBaseUrl: string
): Promise<Invitation> => {
  const response = await client(apiBaseUrl).get(
    `/invitations/token/${encodeURIParameter(token)}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

const revokeInvitation = async (
  id: number,
  apiBaseUrl: string
): Promise<Invitation> => {
  const response = await client(apiBaseUrl).put(
    `/invitations/${id}/revoke`,
    {},
    {
      withCredentials: true,
    }
  );

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export {
  acceptInvitation,
  createInvitation,
  deleteInvitation,
  getAllInvitations,
  getInvitationById,
  getInvitationByToken,
  revokeInvitation,
};
