import { sendPasswordResetEmail } from "supertokens-web-js/recipe/thirdpartyemailpassword";

import type { PasswordResetRequestPayload } from "../types";

const requestPasswordReset = async (
  payload: PasswordResetRequestPayload,
): Promise<boolean> => {
  const response = await sendPasswordResetEmail({
    formFields: [
      {
        id: "email",
        value: payload.email as string,
      },
    ],
  });

  if (response.status == "OK") {
    return true;
  }
  return false;
};

export default requestPasswordReset;
