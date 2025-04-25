import { emailPasswordSignUp } from "supertokens-web-js/recipe/thirdpartyemailpassword";

import type { LoginCredentials, UserType } from "../types";

const signup = async (
  credentials: LoginCredentials,
): Promise<UserType | undefined> => {
  let user: UserType | undefined;
  let response;

  const data = {
    formFields: [
      {
        id: "email",
        value: credentials.email as string,
      },
      {
        id: "password",
        value: credentials.password as string,
      },
    ],
  };

  try {
    response = await emailPasswordSignUp(data);
    // eslint-disable-next-line
  } catch (error) {
    throw new Error("SOMETHING_WRONG");
  }

  if (response.status === "OK") {
    user = response.user as UserType;

    return user;
  } else if (response.status === "FIELD_ERROR") {
    throw new Error("401");
  } else {
    throw new Error("SOMETHING_WRONG");
  }
};

export default signup;
