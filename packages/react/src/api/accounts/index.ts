import { Customer } from "@/types/customer";

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
  } else {
    return response.data;
  }
};
