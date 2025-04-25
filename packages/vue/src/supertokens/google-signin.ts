import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-web-js/recipe/thirdpartyemailpassword";

async function googleSignIn(redirectURL: string) {
  const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
    authorisationURL: `${redirectURL}/auth/callback/google`,
    providerId: "google",
  });

  window.location.assign(authUrl);
}

export default googleSignIn;
