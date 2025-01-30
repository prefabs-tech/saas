import { Email, Password, useFormContext } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { Checkbox } from "@dzangolab/react-ui";
import React from "react";

export const UserFields: React.FC = () => {
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
      <Checkbox
        name="agreement"
        label="I agree to all the Terms and Conditions"
      ></Checkbox>
    </>
  );
};
