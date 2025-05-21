import client from "./axios";
import type { GetAccountUsersResponse } from "../types/accountUser";

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
