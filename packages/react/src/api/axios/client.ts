import axios from "axios";

export const client = (baseURL: string) => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      post: {
        "Content-Type": "application/json",
      },
    },
  });
};
