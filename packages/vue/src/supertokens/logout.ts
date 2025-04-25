import Session from "supertokens-web-js/recipe/session";

const logout = async () => {
  await Session.signOut();
};

export default logout;
