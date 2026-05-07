import {
  emailSchema,
  passwordSchema,
  Provider,
} from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import { z } from "zod";

import { useConfig } from "@/hooks";
import { UserSignupData } from "@/types/account";

import { SignupFormActions } from "./SignupFormActions";
import { UserFields } from "./UserFields";

export type UserSignupProperties = {
  email?: string;
  handleSubmit: (formData: UserSignupData) => void;
  loading?: boolean;
};

export const UserSignupForm = ({
  email,
  handleSubmit,
  loading,
}: UserSignupProperties) => {
  const { t } = useTranslation("accounts");

  const { accounts } = useConfig();
  const { termsAndConditionsUrl } = accounts?.signup || {};

  const onSubmit = (data: UserSignupData) => {
    handleSubmit(data);
  };

  const userSignupSchema = z
    .object({
      confirmPassword: z
        .string()
        .min(1, t("signup.validations.confirmPassword.required")),
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
        className="account-signup"
        defaultValues={{
          confirmPassword: "",
          email: email || "",
          password: "",
        }}
        onSubmit={(data) => onSubmit(data)}
        validationSchema={userSignupSchema}
      >
        <UserFields disableEmailField={!!email} />
        <SignupFormActions loading={loading} showCancel={false} />
      </Provider>
    </>
  );
};
