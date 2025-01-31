import { emailSchema, passwordSchema, Provider } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { ReactNode } from "react";
import { z } from "zod";

import { AccountSignupData } from "@/types/customer";

import { AccountSignupFormFields } from "./AccountSignupFormFields";

export type AccountSignupProperties = {
  loading?: boolean;
  showTermsAndConditions?: boolean;
  termsAndConditionsLabel?: ReactNode;
  handleSubmit: (formData: AccountSignupData) => void;
  onFormStepChange?: (activeStep: number) => void;
};

export const AccountSignupForm = ({
  loading,
  showTermsAndConditions,
  termsAndConditionsLabel,
  handleSubmit,
  onFormStepChange,
}: AccountSignupProperties) => {
  const { t } = useTranslation("accounts");

  const onSubmit = (data: AccountSignupData) => {
    handleSubmit(data);
  };

  const accountSignupSchema = z.object({
    name: z
      .string()
      .max(255, {
        message: t("signup.validations.name.invalid"),
      })
      .min(1, {
        message: t("signup.validations.name.required"),
      }),
    individual: z.boolean(),
    organizationName: z
      .string()
      .max(255, {
        message: t("signup.validations.organizationName.invalid"),
      })
      .nullable(),
    registeredNumber: z
      .string()
      .max(255, {
        message: t("signup.validations.registeredNumber.invalid"),
      })
      .nullable(),
    taxId: z
      .string()
      .max(255, {
        message: t("signup.validations.taxId.invalid"),
      })
      .nullable(),
    slug: z
      .string()
      .max(24, {
        message: t("signup.validations.slug.invalid"),
      })
      .nullable(),
    useSeparateDatabase: z.boolean().nullable(),
    domain: z
      .string()
      .max(253, {
        message: t("signup.validations.domain.invalid"),
      })
      .nullable(),

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

  return (
    <>
      <Provider
        onSubmit={(data) => onSubmit(data)}
        defaultValues={{
          // customer details
          domain: "",
          individual: false,
          name: "",
          organizationName: "",
          registeredNumber: "",
          slug: "",
          taxId: "",
          useSeparateDatabase: false,

          // credentials
          email: "",
          password: "",
          confirmPassword: "",
        }}
        className="account-signup"
        validationSchema={accountSignupSchema as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        <AccountSignupFormFields
          loading={loading}
          showTermsAndConditions={showTermsAndConditions}
          termsAndConditionsLabel={termsAndConditionsLabel}
          onFormStepChange={onFormStepChange}
        />
      </Provider>
    </>
  );
};
