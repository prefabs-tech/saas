import {
  Account,
  AccountSignupData,
  User,
  UserSignupData,
} from "@/types/account";
import { prepareSignupData } from "@/utils";

import { client } from "../axios";

export const doesAccountExist = async ({
  apiBaseUrl,
}: {
  apiBaseUrl: string;
}): Promise<boolean> => {
  const response = await client(apiBaseUrl).get(`/`, {
    withCredentials: true,
  });

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  }

  return response.data;
};

export const getMyAccounts = async ({
  apiBaseUrl,
}: {
  apiBaseUrl: string;
}): Promise<Account[]> => {
  const response = await client(apiBaseUrl).get(`/my-accounts`, {
    withCredentials: true,
  });

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  }

  return response.data;
};

export const signup = async ({
  accountSignup = true,
  apiBaseUrl,
  data,
  path,
}: {
  accountSignup?: boolean;
  apiBaseUrl: string;
  data: AccountSignupData | UserSignupData;
  path: string;
}): Promise<User> => {
  const payload = prepareSignupData({ accountSignup, data });

  const response = await client(apiBaseUrl).post(path, payload, {
    withCredentials: true,
  });

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  }

  return response.data;
};
