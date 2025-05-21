import axios from "axios";

const client = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return instance;
};

export const encodeURIParameter = <T>(argument: T) => {
  return !argument ? undefined : JSON.stringify(argument);
};

export default client;
