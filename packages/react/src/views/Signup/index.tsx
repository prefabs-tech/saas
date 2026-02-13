import { useTranslation } from "@prefabs.tech/react-i18n";
import { AuthPage } from "@prefabs.tech/react-ui";
import { useState } from "react";

import { signup } from "@/api/accounts";
import { AccountSignupForm, UserSignupForm } from "@/components/Signup";
import { SIGNUP_PATH_DEFAULT } from "@/constants";
import { useAccounts, useConfig } from "@/hooks";
import { AccountSignupData, User, UserSignupData } from "@/types/account";

type SignupProperties = {
  onSignupFailure?: (
    err?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    data?: UserSignupData | AccountSignupData,
  ) => Promise<void> | void;
  onSignupSuccess?: (
    res?: User,
    data?: UserSignupData | AccountSignupData,
  ) => Promise<void> | void;
};

export const SignupPage = ({
  onSignupFailure,
  onSignupSuccess,
}: SignupProperties) => {
  const { t } = useTranslation("accounts");

  const {
    meta: { isMainApp },
  } = useAccounts();
  const { apiBaseUrl, accounts, rootDomain } = useConfig();

  const { apiPath = SIGNUP_PATH_DEFAULT, appRedirection = true } =
    accounts?.signup || {};

  const [loading, setLoading] = useState(false);

  const handleSubmit = (data: AccountSignupData | UserSignupData) => {
    setLoading(true);

    signup({ apiBaseUrl, path: apiPath, data })
      .then(async (result) => {
        if (result) {
          if (onSignupSuccess) {
            await onSignupSuccess(result, data);
          }

          if (appRedirection && "slug" in data && data.slug) {
            const appUrl = `${window.location.protocol}//${data.slug}.${rootDomain}`;

            // FIXME Quick solution. Use a better way to handle redirection
            window.location.replace(appUrl);
          }
        }
      })
      .catch(async (error) => {
        if (onSignupFailure) {
          await onSignupFailure(error, data);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthPage
      title={isMainApp ? t("signup.title.account") : t("signup.title.user")}
      centered
    >
      {isMainApp ? (
        <AccountSignupForm handleSubmit={handleSubmit} loading={loading} />
      ) : (
        <UserSignupForm handleSubmit={handleSubmit} loading={loading} />
      )}
    </AuthPage>
  );
};
