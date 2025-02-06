import {
  emailSchema,
  FormActions,
  passwordSchema,
  Provider,
} from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { z } from "zod";

import { UserSignupData } from "@/types/customer";

import { UserFields } from "./UserFields";

export type UserSignupProperties = {
  loading?: boolean;
  handleSubmit: (formData: UserSignupData) => void;
};

export const UserSignupForm = ({
  loading,
  handleSubmit,
}: UserSignupProperties) => {
  const { t } = useTranslation("accounts");

  const onSubmit = (data: UserSignupData) => {
    handleSubmit(data);
  };

  const userSignupSchema = z.object({
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
      .min(1, t("signup.validations.configmPassword.required")),
  });

  const formActions = [
    {
      label: t("signup.actions.submit"),
    },
  ];

  return (
    <>
      <Provider
        onSubmit={(data) => onSubmit(data)}
        defaultValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        className="account-signup"
        validationSchema={userSignupSchema}
      >
        <UserFields />
        <FormActions actions={formActions} alignment="fill" loading={loading} />
      </Provider>
    </>
  );
};
