import SuperTokens from "supertokens-web-js";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import Session from "supertokens-web-js/recipe/session";
import ThirdPartyEmailPassword from "supertokens-web-js/recipe/thirdpartyemailpassword";

import changeEmail from "./change-email";
import changePassword from "./change-password";
import googleSignIn from "./google-signin";
import { isProfileCompleted, verifySessionRoles } from "./helper";
import login from "./login";
import logout from "./logout";
import requestPasswordReset from "./request-password-reset";
import resendVerificationEmail from "./resend-email-verification";
import resetPassword from "./reset-password";
import signup from "./signup";
import { SUPERTOKENS_API_BASE_PATH_DEFAULT } from "../constant";
import useUserStore from "../store";
import verifyEmail, { getVerificationStatus } from "./verify-email";

import type { UserType } from "../types";
import type { AppConfig } from "@dzangolab/vue3-config";

const initSupertokens = (config: AppConfig) => {
  useUserStore();

  // eslint-disable-next-line
  const recipeList: Array<any> = [
    ThirdPartyEmailPassword.init(),
    Session.init(),
  ];

  if (config.user?.features?.signUp?.emailVerification) {
    recipeList.push(EmailVerification.init());
  }

  SuperTokens.init({
    appInfo: {
      apiDomain: config.apiBaseUrl,
      appName: config.appTitle,
      apiBasePath: config.authBasePath || SUPERTOKENS_API_BASE_PATH_DEFAULT,
    },
    recipeList: recipeList,
  });
};

const isLoggedIn = async () => {
  return await Session.doesSessionExist();
};

const getUser = async (): Promise<UserType | undefined> => {
  const { getUser } = useUserStore();

  if (await isLoggedIn()) {
    return getUser();
  }
};

export default initSupertokens;

export {
  changeEmail,
  changePassword,
  getUser,
  getVerificationStatus,
  googleSignIn,
  isProfileCompleted,
  isLoggedIn,
  login,
  logout,
  requestPasswordReset,
  resendVerificationEmail,
  resetPassword,
  signup,
  verifyEmail,
  verifySessionRoles,
};
