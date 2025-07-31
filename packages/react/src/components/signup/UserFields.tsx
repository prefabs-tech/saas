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
    register,
    getFieldState,
  } = useFormContext();

  return (
    <>
      <Email
        label={t("signup.fields.email.label")}
        name="email"
        placeholder={t("signup.fields.email.placeholder")}
        disabled={disableEmailField}
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
        <CheckboxInput
          name="termsAndConditions"
          inputLabel={
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
        ></CheckboxInput>
      )}
    </>
  );
};
