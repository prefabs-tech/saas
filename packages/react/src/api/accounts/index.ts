import {
  AccountSignupData,
  Account,
  UserSignupData,
  User,
} from "@/types/account";
import { prepareSignupData } from "@/utils";

import { client } from "../axios";

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
  apiBaseUrl,
  signupPath,
  data,
  accountSignup = true,
}: {
  apiBaseUrl: string;
  signupPath: string;
  data: AccountSignupData | UserSignupData;
  accountSignup?: boolean;
}): Promise<User> => {
  const payload = prepareSignupData({ data, accountSignup });

  const response = await client(apiBaseUrl).post(signupPath, payload, {
    withCredentials: true,
  });

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  }

  return response.data;
};
