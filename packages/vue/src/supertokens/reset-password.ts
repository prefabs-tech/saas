import { submitNewPassword } from "supertokens-web-js/recipe/thirdpartyemailpassword";

import type { PasswordResetPayload } from "../types";

const resetPassword = async (
  payload: PasswordResetPayload,
): Promise<boolean> => {
  const response = await submitNewPassword({
    formFields: [
      {
        id: "password",
        value: payload.password as string,
      },
    ],
  });

  if (response.status == "OK") {
    return true;
  }
  return false;
};

export default resetPassword;
