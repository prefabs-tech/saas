import client from "../api/axios";

import type { ChangePasswordPayload } from "../types";

const changePassword = async (
  payload: ChangePasswordPayload,
  apiBaseUrl: string,
): Promise<boolean | undefined> => {
  let success = false;

  try {
    const response = await client(apiBaseUrl).post(
      "/change_password",
      {
        oldPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      },
      {
        withCredentials: true,
      },
    );

    if (response.data.status === "OK") {
      success = true;
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    let errorMessage = "Oops! Something went wrong.";
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }

  return success;
};

export default changePassword;
