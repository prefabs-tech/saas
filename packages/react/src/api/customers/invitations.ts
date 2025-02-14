import {
  AddInvitationResponse,
  ResendInvitationResponse,
  RevokeInvitationResponse,
  DeleteInvitationResponse,
} from "@/types";

import client from "../axios";
import { TRequestJSON } from "@dzangolab/react-ui";
import { encodeURIParameter } from "../utils";

export const getInvitations = async (
  customerId: string,
  requestJSON: TRequestJSON | null,
  apiBaseUrl: string,
): Promise<AddInvitationResponse> => {
  const params = {
    filters: encodeURIParameter(requestJSON?.filter),
    limit: encodeURIParameter(requestJSON?.limit),
    offset: encodeURIParameter(requestJSON?.offset),
    sort: encodeURIParameter(requestJSON?.sort),
  };

  const response = await client(apiBaseUrl).get(
    `customers/${customerId}/invitations`,
    {
      params,
    },
  );

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const addInvitation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invitationData: any,
  apiBaseUrl: string,
): Promise<AddInvitationResponse> => {
  const response = await client(apiBaseUrl).post(
    "/customers/invitations",
    invitationData,
    {
      withCredentials: true,
    },
  );

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const resendInvitation = async (
  id: number,
  apiBaseUrl: string,
): Promise<ResendInvitationResponse> => {
  const response = await client(apiBaseUrl).post(
    `invitations/resend/${id}`,
    {},
    {
      withCredentials: true,
    },
  );

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const revokeInvitation = async (
  id: number,
  apiBaseUrl: string,
): Promise<RevokeInvitationResponse> => {
  const response = await client(apiBaseUrl).put(
    `invitations/revoke/${id}`,
    {},
    {
      withCredentials: true,
    },
  );

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const deleteInvitation = async (
  id: number,
  apiBaseUrl: string,
): Promise<DeleteInvitationResponse> => {
  const response = await client(apiBaseUrl).delete(`invitations/${id}`);

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};
