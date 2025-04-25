import client, { encodeURIParameter } from "./axios";
import type { Account, AccountInput } from "../types/account";

export const createAccount = async (
  data: AccountInput,
  apiBaseUrl: string
): Promise<Account> => {
  const response = await client(apiBaseUrl).post("/accounts", data, {
    withCredentials: true,
  });

  return response.data;
};

export const deleteAccount = async (
  id: string,
  apiBaseUrl: string
): Promise<void> => {
  await client(apiBaseUrl).delete(`/accounts/${encodeURIParameter(id)}`, {
    withCredentials: true,
  });
};

export const getAccount = async (
  id: string,
  apiBaseUrl: string
): Promise<Account> => {
  const response = await client(apiBaseUrl).get(
    `/accounts/${encodeURIParameter(id)}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getAccounts = async (apiBaseUrl: string): Promise<Account[]> => {
  const response = await client(apiBaseUrl).get("/accounts", {
    withCredentials: true,
  });

  return response.data;
};

export const updateAccount = async (
  id: string,
  data: AccountInput,
  apiBaseUrl: string
): Promise<Account> => {
  const response = await client(apiBaseUrl).put(
    `/accounts/${encodeURIParameter(id)}`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};
