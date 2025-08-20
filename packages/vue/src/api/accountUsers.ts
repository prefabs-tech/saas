import { client } from "./axios";
import type {
  DisableAccountUserResponse,
  EnableAccountUserResponse,
  GetAccountUsersResponse,
} from "../types/accountUser";

export const disableUser = async (
  userId: string,
  apiBaseUrl: string
): Promise<DisableAccountUserResponse> => {
  const response = await client(apiBaseUrl).put(
    `/users/${userId}/disable`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const enableUser = async (
  userId: string,
  apiBaseUrl: string
): Promise<EnableAccountUserResponse> => {
  const response = await client(apiBaseUrl).put(
    `/users/${userId}/enable`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getUsers = async (
  accountId: string,
  apiBaseUrl: string,
  params?: object
): Promise<GetAccountUsersResponse> => {
  const response = await client(apiBaseUrl).get(
    `/accounts/${accountId}/users`,
    {
      params,
      withCredentials: true,
    }
  );

  return response.data;
};
