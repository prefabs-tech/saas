import { defineStore } from "pinia";
import { ref } from "vue";

import { auth } from "./auth-provider";

import {
  acceptInvitation as doAcceptInvitation,
  addInvitation as doAddInvitation,
  disableUser as doDisableUser,
  enableUser as doEnableUser,
  getIsFirstUser as doGetIsFirstUser,
  getInvitationByToken as doGetInvitation,
  signUpFirstUser as doSignUpFirstUser,
} from "./api/user";

import type {
  AuthTokens,
  Invitation,
  LoginCredentials,
  PasswordResetPayload,
  PasswordResetRequestPayload,
  ChangePasswordPayload,
  UserType,
} from "./types";

const USER_KEY = "user";

const useUserStore = defineStore("user", () => {
  const invitation = ref<Invitation>();
  const user = ref<UserType | undefined>(undefined);
  const accessToken = ref(localStorage.getItem("accessToken") || null);
  const refreshToken = ref(localStorage.getItem("refreshToken") || null);

  const acceptInvitation = async (
    token: string,
    credential: LoginCredentials,
    apiBaseUrl: string,
  ) => {
    return await doAcceptInvitation(token, credential, apiBaseUrl);
  };

  const addInvitation = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invitationData: any,
    apiBaseUrl: string,
  ) => {
    return await doAddInvitation(invitationData, apiBaseUrl);
  };

  const changePassword = async (
    payload: ChangePasswordPayload,
    apiBaseUrl: string
  ) => {
    const selectedAuthProvider = auth();

    if ("doChangePassword" in selectedAuthProvider) {
      const response = await selectedAuthProvider.doChangePassword(
        payload,
        apiBaseUrl
      );

      return response;
    }

    throw new Error(
      "Change password is not supported for the selected auth provider"
    );
  };

  const disableUser = async (id: string, apiBaseUrl: string) => {
    return await doDisableUser(id, apiBaseUrl);
  };

  const enableUser = async (id: string, apiBaseUrl: string) => {
    return await doEnableUser(id, apiBaseUrl);
  };

  const getIsFirstUser = async (
    apiBaseUrl: string,
  ) => {
    return await doGetIsFirstUser(apiBaseUrl);
  };

  const getInvitationByToken = async (
    token: string,
    apiBaseUrl: string,
  ) => {
    return await doGetInvitation(token, apiBaseUrl);
  };

  const getUser = (): UserType => {
    if (user.value) {
      return user.value;
    }

    const data = localStorage.getItem(USER_KEY);

    return data ? JSON.parse(data) : undefined;
  };

  const googleSignIn = async (redirectURL: string) => {
    const selectedAuthProvider = auth();

    if ("doGoogleSignIn" in selectedAuthProvider) {
      await selectedAuthProvider.doGoogleSignIn(redirectURL);
    }

    throw new Error(
      "Google signin is not supported for the selected auth provider"
    );
  };

  const login = async (credentials: LoginCredentials) => {
    const selectedAuthProvider = auth();

    const response = await selectedAuthProvider.doLogin(credentials);

    return response;
  };

  const logout = async () => {
    const selectedAuthProvider = auth();

    await selectedAuthProvider.doLogout().then(() => {
      user.value = undefined;

      // FIXME [SS 17 MARCH 2023]
      document.cookie =
        "sFrontToken=; Max-Age=0; path=/; domain=" + location.hostname;
    });

    removeUser();
  };

  const removeAuthTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const removeUser = () => {
    localStorage.removeItem(USER_KEY);
  };

  const requestPasswordReset = async (
    payload: PasswordResetRequestPayload
  ): Promise<boolean> => {
    const selectedAuthProvider = auth();

    if ("doRequestPasswordReset" in selectedAuthProvider) {
      return selectedAuthProvider.doRequestPasswordReset(payload);
    }

    throw new Error(
      "Request password reset is not supported for the selected auth provider"
    );
  };

  const resetPassword = async (
    payload: PasswordResetPayload
  ): Promise<boolean> => {
    const selectedAuthProvider = auth();

    if ("doResetPassword" in selectedAuthProvider) {
      return selectedAuthProvider.doResetPassword(payload);
    }

    throw new Error(
      "Reset password is not supported for the selected auth provider"
    );
  };

  const setInvitation = (invitationData: Invitation | undefined) => {
    invitation.value = invitationData;
  };

  const setUser = async (userData: UserType | undefined) => {
    const selectedAuthProvider = auth();

    user.value = userData;

    if (user.value && "isProfileCompleted" in selectedAuthProvider) {
      user.value.isProfileCompleted = await selectedAuthProvider.isProfileCompleted();
    }

    localStorage.setItem(USER_KEY, JSON.stringify(user.value));
  };

  const setAuthTokens = (authTokens: AuthTokens) => {
    accessToken.value = authTokens.accessToken;
    refreshToken.value = authTokens.refreshToken as string | null;

    localStorage.setItem("accessToken", authTokens.accessToken as string);
    localStorage.setItem("refreshToken", authTokens.refreshToken as string);
  };

  const signup = async (credentials: LoginCredentials): Promise<void> => {
    const selectedAuthProvider = auth();

    if ("doSignup" in selectedAuthProvider) {
      const response = await selectedAuthProvider.doSignup(credentials);

      setUser(response);
    }

    throw new Error("Signup is not supported for the selected auth provider");
  };

  const signUpFirstUser = async (credentials: LoginCredentials, apiBaseUrl: string,): Promise<void> => {
    const response = await doSignUpFirstUser(credentials, apiBaseUrl);

    setUser(response);
  };

  return {
    accessToken,
    acceptInvitation,
    addInvitation,
    changePassword,
    disableUser,
    enableUser,
    googleSignIn,
    getIsFirstUser,
    getInvitationByToken,
    getUser,
    invitation,
    login,
    logout,
    refreshToken,
    removeAuthTokens,
    removeUser,
    resetPassword,
    requestPasswordReset,
    setAuthTokens,
    signUpFirstUser,
    setInvitation,
    setUser,
    signup,
    user,
  };
});

export default useUserStore;
