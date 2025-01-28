import {
  Email,
  FormActions,
  Password,
  TextInput,
  useFormContext,
} from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import React from "react";

interface IProperties {
  loading?: boolean;
  disableEmailField?: boolean;
}

export const SignupFormFields: React.FC<IProperties> = ({
  loading,
  disableEmailField = false,
}) => {
  const { t } = useTranslation("user");
  const {
    register,
    getFieldState,
    formState: { errors, submitCount },
    control,
  } = useFormContext();

  return (
    <>
      <TextInput
        label="Customer name"
        name="customerName"
        placeholder="Customer name"
        submitCount={submitCount}
        disabled={disableEmailField}
      />

      <Email
        label={t("signup.form.email.label")}
        name="email"
        placeholder={t("signup.form.email.placeholder")}
        submitCount={submitCount}
        disabled={disableEmailField}
      />
      <Password
        label={t("signup.form.password.label")}
        name="password"
        register={register}
        getFieldState={getFieldState}
        submitCount={submitCount}
      />
      <Password
        label={t("signup.form.confirmPassword.label")}
        name="confirmPassword"
        register={register}
        getFieldState={getFieldState}
        submitCount={submitCount}
      />

      <FormActions
        actions={[
          {
            id: "submit",
            disabled: !!Object.values(errors).length,
            label: t("signup.form.actions.submit"),
          },
        ]}
        loading={loading}
        alignment="fill"
      />
    </>
  );
};
