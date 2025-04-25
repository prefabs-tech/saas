import { AxiosError } from "axios";

import client from "../api/axios";

import type { ChangePasswordPayload, UserType } from "../types";

const changePassword = async (
  payload: ChangePasswordPayload,
  apiBaseUrl: string,
  path: string,
): Promise<UserType | undefined> => {
  let user: UserType | undefined;
  let response;

  try {
    response = await client(apiBaseUrl).put(path, payload, {
      withCredentials: true,
    });
    if (response.status === 200) {
      user = response.data as UserType;

      return user;
    }
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

export default changePassword;
