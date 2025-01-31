import { Email, Password, useFormContext } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { Checkbox } from "@dzangolab/react-ui";
import React, { ReactNode } from "react";

type Properties = {
  showTermsAndConditions?: boolean;
  termsAndConditionsLabel?: ReactNode;
};

export const UserFields: React.FC<Properties> = ({
  showTermsAndConditions = true,
  termsAndConditionsLabel,
}) => {
  const { t } = useTranslation("accounts");

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
        submitCount={submitCount}
      />
      <Password
        label={t("signup.fields.password.label")}
        name="password"
        register={register}
        getFieldState={getFieldState}
        submitCount={submitCount}
        helperText={t("signup.fields.password.helper")}
      />
      <Password
        label={t("signup.fields.confirmPassword")}
        name="confirmPassword"
        register={register}
        getFieldState={getFieldState}
        submitCount={submitCount}
      />
      {showTermsAndConditions && (
        <Checkbox name="agreement" label={termsAndConditionsLabel}></Checkbox>
      )}
    </>
  );
};
