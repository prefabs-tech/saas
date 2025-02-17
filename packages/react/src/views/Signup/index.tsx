import { useTranslation } from "@dzangolab/react-i18n";
import { AuthPage } from "@dzangolab/react-ui";
import { useState } from "react";

import { signup } from "@/api/accounts";
import { CustomerSignupForm, UserSignupForm } from "@/components/accounts";
import { SIGNUP_PATH_DEFAULT } from "@/constants";
import { useAccounts, useConfig } from "@/hooks";
import { CustomerSignupData, UserSignupData } from "@/types/customer";

type SignupProperties = {
  onSignupFailure?: (err: any) => Promise<void> | void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onSignupSuccess?: (res: any) => Promise<void> | void; // eslint-disable-line @typescript-eslint/no-explicit-any
};
export const Signup = ({
  onSignupFailure,
  onSignupSuccess,
}: SignupProperties) => {
  const { t } = useTranslation("accounts");

  const {
    meta: { isMainApp },
  } = useAccounts();
  const { apiBaseUrl, accounts, rootDomain } = useConfig();

  const { path: signupPath = SIGNUP_PATH_DEFAULT, appRedirection = true } =
    accounts?.signup || {};

  const [loading, setLoading] = useState(false);

  const handleSubmit = (data: CustomerSignupData | UserSignupData) => {
    setLoading(true);

    signup({ apiBaseUrl, signupPath, data })
      .then(async (result) => {
        if (result) {
          if (onSignupSuccess) {
            await onSignupSuccess(result);
          }

          if (appRedirection && "slug" in data && data.slug) {
            const appUrl = `http://${data.slug}.${rootDomain}`; // FIXME http used to support local testing

            window.open(appUrl, "_blank");
          }
        }
      })
      .catch(async (error) => {
        if (onSignupFailure) {
          await onSignupFailure(error);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthPage
      title={isMainApp ? t("signup.title.customer") : t("signup.title.user")}
      centered
    >
      {isMainApp ? (
        <CustomerSignupForm handleSubmit={handleSubmit} loading={loading} />
      ) : (
        <UserSignupForm handleSubmit={handleSubmit} loading={loading} />
      )}
    </AuthPage>
  );
};
