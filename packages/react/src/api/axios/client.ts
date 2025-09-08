import axios from "axios";

import { ACCOUNT_HEADER_NAME } from "@/constants";

export const client = (baseURL: string) => {
  // FIXME: not efficient to read from both sessionStorage and localStorage on every request.
  let accountId = sessionStorage.getItem(ACCOUNT_HEADER_NAME);
  if (accountId) {
    accountId = localStorage.getItem(ACCOUNT_HEADER_NAME);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers: any = {
    post: {
      "Content-Type": "application/json",
    },
  };

  if (accountId) {
    headers[ACCOUNT_HEADER_NAME] = accountId;
  }

  return axios.create({
    baseURL: baseURL,
    headers: headers,
  });
};
