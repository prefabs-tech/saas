import {
  CustomerSignupData,
  Customer,
  UserSignupData,
  User,
} from "@/types/customer";
import { prepareSignupData } from "@/utils";

import client from "../axios";

export const getMyAccounts = async ({
  apiBaseUrl,
}: {
  apiBaseUrl: string;
}): Promise<Customer[]> => {
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
  customerSignup = true,
}: {
  apiBaseUrl: string;
  signupPath: string;
  data: CustomerSignupData | UserSignupData;
  customerSignup?: boolean;
}): Promise<User> => {
  const payload = prepareSignupData({ data, customerSignup });

  const response = await client(apiBaseUrl).post(signupPath, payload, {
    withCredentials: true,
  });

  if (response.data.status === "ERROR") {
    throw new Error(response.data.message);
  }

  return response.data;
};
