import axios from "axios";

import { ACCOUNT_HEADER_NAME } from "@/constants";

export const client = (baseURL: string) => {
  const accountId = sessionStorage.getItem(ACCOUNT_HEADER_NAME);

  return axios.create({
    baseURL: baseURL,
    headers: {
      post: {
        "Content-Type": "application/json",
      },
      [ACCOUNT_HEADER_NAME]: accountId || "",
    },
  });
};
