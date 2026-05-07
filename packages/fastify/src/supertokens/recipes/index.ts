import type {
  EmailVerificationRecipe,
  SessionRecipe,
  ThirdPartyEmailPasswordRecipe,
} from "@prefabs.tech/fastify-user";

import { sendEmailVerificationEmail } from "./email-verification";
import { createNewSession, verifySession } from "./session";
import {
  emailPasswordSignIn,
  emailPasswordSignInPOST,
  emailPasswordSignUp,
  emailPasswordSignUpPOST,
  generatePasswordResetTokenPOST,
  getUserById,
  resetPasswordUsingToken,
  sendPasswordResetEmail,
  thirdPartySignInUp,
  thirdPartySignInUpPOST,
} from "./third-party-email-password";

const emailVerificationConfig: EmailVerificationRecipe = {
  sendEmail: sendEmailVerificationEmail,
};

const sessionConfig: SessionRecipe = {
  override: {
    apis: {
      verifySession,
    },
    functions: {
      createNewSession,
    },
  },
};

const thirdPartyEmailPasswordConfig: ThirdPartyEmailPasswordRecipe = {
  override: {
    apis: {
      emailPasswordSignInPOST,
      emailPasswordSignUpPOST,
      generatePasswordResetTokenPOST,
      thirdPartySignInUpPOST,
    },
    functions: {
      emailPasswordSignIn,
      emailPasswordSignUp,
      getUserById,
      resetPasswordUsingToken,
      thirdPartySignInUp,
    },
  },
  sendEmail: sendPasswordResetEmail,
};

const recipes = {
  emailVerification: emailVerificationConfig,
  session: sessionConfig,
  thirdPartyEmailPassword: thirdPartyEmailPasswordConfig,
};

export default recipes;
