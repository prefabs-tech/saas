import axios from "axios";

import { STORAGE_KEY_DEFAULT } from "@/constants";

export const client = (baseURL: string) => {
  const accountId = sessionStorage.getItem(STORAGE_KEY_DEFAULT);

  return axios.create({
    baseURL: baseURL,
    headers: {
      post: {
        "Content-Type": "application/json",
      },
      "x-account-id": accountId || "",
    },
  });
};
