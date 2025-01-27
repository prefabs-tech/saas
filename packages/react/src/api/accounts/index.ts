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
    return [
      {
        id: "b25ccc5d-2078-48e2-b414-c1091e37ee85",
        name: "Ben",
        organizationName: "",
        registeredNumber: "",
        taxId: "",
        individual: true,
        slug: "ben",
        database: "s_ijlau1np",
        domain: null,
      },
      {
        id: "b25ccc5d-2078-48e2-b414-c1091e37bb99",
        name: "Dzango",
        organizationName: "",
        registeredNumber: "",
        taxId: "",
        individual: true,
        slug: "ben",
        database: "s_ijlau1np",
        domain: null,
      },
    ];
  }
};
