import { emailSchema, passwordSchema, Provider } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { z } from "zod";

import { useConfig } from "@/hooks";
import { UserSignupData } from "@/types/account";

import { SignupFormActions } from "./SignupFormActions";
import { UserFields } from "./UserFields";

export type UserSignupProperties = {
  email?: string;
  loading?: boolean;
  handleSubmit: (formData: UserSignupData) => void;
};

export const UserSignupForm = ({
  email,
  loading,
  handleSubmit,
}: UserSignupProperties) => {
  const { t } = useTranslation("accounts");

  const { accounts } = useConfig();
  const { termsAndConditionsUrl } = accounts?.signup || {};

  const onSubmit = (data: UserSignupData) => {
    handleSubmit(data);
  };

  const userSignupSchema = z
    .object({
      email: emailSchema({
        invalid: t("signup.validations.email.invalid"),
        required: t("signup.validations.email.required"),
      }),
      password: passwordSchema(
        {
          required: t("signup.validations.password.required"),
          weak: t("signup.validations.password.invalid"),
        },
        {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 0,
          minUppercase: 1,
        },
      ),
      confirmPassword: z
        .string()
        .min(1, t("signup.validations.confirmPassword.required")),
      ...(termsAndConditionsUrl
        ? {
            termsAndConditions: z.boolean().refine((value) => value === true, {
              message: t("signup.validations.termsAndConditions.required"),
            }),
          }
        : {}),
    })
    .refine(
      (data) => {
        return data.password === data.confirmPassword;
      },
      {
        message: t("signup.validations.confirmPassword.mustMatch"),
        path: ["confirmPassword"],
      },
    );
  return (
    <>
      <Provider
        onSubmit={(data) => onSubmit(data)}
        defaultValues={{
          email: email || "",
          password: "",
          confirmPassword: "",
        }}
        className="account-signup"
        validationSchema={userSignupSchema}
      >
        <UserFields disableEmailField={!!email} />
        <SignupFormActions loading={loading} showCancel={false} />
      </Provider>
    </>
  );
};
