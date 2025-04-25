import client from "../axios";
import { ERROR_NOT_FOUND, STATUS_ERROR } from "../../constant";

import type {
  Invitation,
  LoginCredentials,
  UpdateProfileInputType,
  UserType
} from "../../types";

export const acceptInvitation = async (
  token: string,
  credential: LoginCredentials,
  apiBaseUrl: string,
) => {
  const response = await client(apiBaseUrl).post(
    `invitations/token/${token}`,
    credential,
    {
      withCredentials: true,
    },
  );

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const addInvitation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invitationData: any,
  apiBaseUrl: string,
): Promise<Invitation> => {
  const response = await client(apiBaseUrl).post(
    "/invitations",
    invitationData,
    {
      withCredentials: true,
    },
  );

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const disableUser = async (id: string, apiBaseUrl: string) => {
  const response = await client(apiBaseUrl).put(
    `users/${id}/disable`,
    {},
    { withCredentials: true },
  );

  if (response.status === ERROR_NOT_FOUND) {
    throw new Error(response.data.message);
  } else {
    return response;
  }
};

export const enableUser = async (id: string, apiBaseUrl: string) => {
  const response = await client(apiBaseUrl).put(
    `users/${id}/enable`,
    {},
    {
      withCredentials: true,
    },
  );

  if (response.status === ERROR_NOT_FOUND) {
    throw new Error(response.data.message);
  } else {
    return response;
  }
};

export const getIsFirstUser = async (
  apiBaseUrl: string,
): Promise<{
  signUp: boolean;
}> => {
  const response = await client(apiBaseUrl).get(`signup/admin`);

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const getInvitationByToken = async (
  token: string,
  apiBaseUrl: string,
): Promise<Invitation> => {
  const response = await client(apiBaseUrl).get(`invitations/token/${token}`);

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const getMe = async (
  apiBaseUrl: string,
): Promise<{ data: UserType }> => {
  const response = await client(apiBaseUrl).get(`me`, {
    withCredentials: true,
  });

  if ("error" in response.data) {
    throw new Error(response.data.message);
  } else {
    return response;
  }
};

export const signUpFirstUser = async (
  credential: LoginCredentials,
  apiBaseUrl: string,
): Promise<UserType> => {
  const response = await client(apiBaseUrl).post(`signup/admin`, credential, {
    withCredentials: true,
  });

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data?.user;
  }
};

export const updateUserProfile = async (
  data: UpdateProfileInputType,
  apiBaseUrl: string,
): Promise<{ data: UserType }> => {
  const response = await client(apiBaseUrl).put(`me`, data, {
    withCredentials: true,
  });

  if ("error" in response.data) {
    throw new Error(response.data.message);
  } else {
    return response;
  }
};
