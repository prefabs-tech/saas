import { client } from "./axios";
import type { Account, AccountInput, Accounts } from "../types/account";

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
  await client(apiBaseUrl).delete(`/accounts/${id}`, {
    withCredentials: true,
  });
};

export const getAccount = async (
  id: string,
  apiBaseUrl: string
): Promise<Account> => {
  const response = await client(apiBaseUrl).get(`/accounts/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

export const getAccounts = async (apiBaseUrl: string): Promise<Accounts> => {
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
  const response = await client(apiBaseUrl).put(`/accounts/${id}`, data, {
    withCredentials: true,
  });

  return response.data;
};

export const getMyAccounts = async (apiBaseUrl: string): Promise<Account[]> => {
  const response = await client(apiBaseUrl).get("/my-accounts", {
    withCredentials: true,
  });

  return response.data;
};

export const getMyAccount = async (apiBaseUrl: string): Promise<Account> => {
  const response = await client(apiBaseUrl).get("/my-account", {
    withCredentials: true,
  });

  return response.data;
};

export const updateMyAccount = async (
  data: AccountInput,
  apiBaseUrl: string
): Promise<Account> => {
  const response = await client(apiBaseUrl).put("/my-account", data, {
    withCredentials: true,
  });

  return response.data;
};

export const doesAccountExist = async (
  apiBaseUrl: string
): Promise<boolean> => {
  // Use a simple health check or available endpoint
  // For now, let's just return true and let the actual API calls handle errors
  return true;
};
