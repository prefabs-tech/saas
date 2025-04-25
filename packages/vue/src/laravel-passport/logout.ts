import { AxiosError } from "axios";

import useUserStore from ".././store";
import client from "../api/axios";

const logout = async (apiBaseUrl: string, path: string) => {
  const userStore = useUserStore();

  try {
    await client(apiBaseUrl).post(path, {
      withCredentials: true,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error("401");
      } else {
        throw new Error("SOMETHING_WRONG");
      }
    } else {
      throw new Error("SOMETHING_WRONG");
    }
  }
};

export default logout;
