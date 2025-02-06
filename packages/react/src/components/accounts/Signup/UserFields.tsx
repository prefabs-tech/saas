import { Email, Password, useFormContext } from "@dzangolab/react-form";
import { Trans, useTranslation } from "@dzangolab/react-i18n";
import { Checkbox } from "@dzangolab/react-ui";
import React from "react";

import { useConfig } from "@/hooks";

export const UserFields = () => {
  const { t } = useTranslation("accounts");

  const { accounts } = useConfig();
  const { termsAndConditionsUrl } = accounts?.signup || {};

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors, submitCount },
    register,
    getFieldState,
  } = useFormContext();

  return (
    <>
      <Email
        label={t("signup.fields.email.label")}
        name="email"
        placeholder={t("signup.fields.email.placeholder")}
      />
      <Password
        label={t("signup.fields.password.label")}
        name="password"
        register={register}
        getFieldState={getFieldState}
        helperText={t("signup.fields.password.helper")}
      />
      <Password
        label={t("signup.fields.confirmPassword")}
        name="confirmPassword"
        register={register}
        getFieldState={getFieldState}
      />
      {termsAndConditionsUrl && (
        <Checkbox
          name="agreement"
          label={
            <Trans i18nKey="accounts:signup.termsAndConditions">
              <a
                href={termsAndConditionsUrl}
                className="inline-link underlined"
                target="_blank"
              >
                Terms and Conditions
              </a>
            </Trans>
          }
        ></Checkbox>
      )}
    </>
  );
};
