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
