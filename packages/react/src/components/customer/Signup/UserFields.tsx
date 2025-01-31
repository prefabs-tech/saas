import { Email, Password, useFormContext } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { Checkbox } from "@dzangolab/react-ui";
import React, { ReactNode } from "react";

type Properties = {
  showTermsAndConditions?: boolean;
  termsAndConditionsLabel?: string;
};

export const UserFields: React.FC<Properties> = ({
  showTermsAndConditions = true,
  termsAndConditionsLabel,
}) => {
  const { t } = useTranslation("accounts");

  const {
    register,
    getFieldState,
    formState: { errors, submitCount },
  } = useFormContext();

  return (
    <>
      <Email
        label={t("customer.form.fields.email.label")}
        name="email"
        placeholder={t("customer.form.fields.email.placeholder")}
        submitCount={submitCount}
      />
      <Password
        label={t("customer.form.fields.password.label")}
        name="password"
        register={register}
        getFieldState={getFieldState}
        submitCount={submitCount}
        helperText={t("customer.form.fields.password.helper")}
      />
      <Password
        label={t("customer.form.fields.confirmPassword")}
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
