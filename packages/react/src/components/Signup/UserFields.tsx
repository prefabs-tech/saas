import {
  CheckboxInput,
  Email,
  Password,
  useFormContext,
} from "@prefabs.tech/react-form";
import { Trans, useTranslation } from "@prefabs.tech/react-i18n";
import React from "react";

import { useConfig } from "@/hooks";

type Properties = {
  disableEmailField?: boolean;
};

export const UserFields = ({ disableEmailField = false }: Properties) => {
  const { t } = useTranslation("accounts");

  const { accounts } = useConfig();
  const { termsAndConditionsUrl } = accounts?.signup || {};

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors, submitCount },
    getFieldState,
    register,
  } = useFormContext();

  return (
    <>
      <Email
        disabled={disableEmailField}
        label={t("signup.fields.email.label")}
        name="email"
        placeholder={t("signup.fields.email.placeholder")}
      />
      <Password
        getFieldState={getFieldState}
        helperText={t("signup.fields.password.helper")}
        label={t("signup.fields.password.label")}
        name="password"
        register={register}
      />
      <Password
        getFieldState={getFieldState}
        label={t("signup.fields.confirmPassword")}
        name="confirmPassword"
        register={register}
      />
      {termsAndConditionsUrl && (
        <CheckboxInput
          inputLabel={
            <Trans i18nKey="accounts:signup.termsAndConditions">
              <a
                className="inline-link underlined"
                href={termsAndConditionsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Terms and Conditions
              </a>
            </Trans>
          }
          name="termsAndConditions"
        ></CheckboxInput>
      )}
    </>
  );
};
