import axios from "axios";

export const client = (baseURL: string) => {
  const accountId = sessionStorage.getItem("x-account-id");

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
