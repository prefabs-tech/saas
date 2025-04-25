import Session from "supertokens-web-js/recipe/session";
import { UserRoleClaim } from "supertokens-web-js/recipe/userroles";

import useUserStore from "../store";
import { ProfileValidationClaim } from "./profile-validation-claim";

export async function verifySessionRoles(claims: string[]): Promise<boolean> {
  if (await Session.doesSessionExist()) {
    let errorCount = 0;

    const validationErrors = await Session.validateClaims({
      overrideGlobalClaimValidators: (globalValidators) => {
        const validators = claims.map((claim) =>
          UserRoleClaim.validators.includes(claim),
        );

        return [...globalValidators, ...validators];
      },
    });

    if (validationErrors.length === 0) {
      return true;
    }

    for (const err of validationErrors) {
      if (err.validatorId === UserRoleClaim.id) {
        // user roles claim check failed
        errorCount += 1;
      } else {
        // some other claim check failed (from the global validators list)
      }
    }

    if (errorCount < claims.length) {
      // some user roles claim check passed
      return true;
    } else {
      const userStore = useUserStore();

      const { logout } = userStore;
      // all user roles claim check failed
      await logout();
    }
  }
  // either a session does not exist, or one of the validators failed.
  // so we do not allow access to this page.
  return false;
}

/**
 * Checks if the user's profile is completed based on validation criteria.
 *
 * @async
 * @function isProfileCompleted
 * @returns {Promise<boolean|undefined>} - A promise that resolves to:
 *   - `true` if the profile is completed.
 *   - `false` if the profile is not completed or no session exists.
 *   - `undefined` if the profile validation is disabled in the api.
 *
 */
export const isProfileCompleted = async (): Promise<boolean | undefined> => {
  const profileClaim = await Session.getClaimValue({
    claim: new ProfileValidationClaim(),
  });

  if (!profileClaim) {
    return;
  }

  if (profileClaim.isVerified) {
    return true;
  }

  if (profileClaim.gracePeriodEndsAt) {
    return profileClaim.gracePeriodEndsAt >= Date.now();
  }

  return false;
};
