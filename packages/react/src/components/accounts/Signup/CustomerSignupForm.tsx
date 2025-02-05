import { emailSchema, passwordSchema, Provider } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { z } from "zod";

import { CustomerSignupData } from "@/types/customer";

import { CustomerSignupFormFields } from "./CustomerSignupFormFields";

export type CustomerSignupProperties = {
  loading?: boolean;
  handleSubmit: (formData: CustomerSignupData) => void;
  onFormStepChange?: (activeStep: number) => void;
};

export const CustomerSignupForm = ({
  loading,
  handleSubmit,
  onFormStepChange,
}: CustomerSignupProperties) => {
  const { t } = useTranslation("accounts");

  const onSubmit = (data: CustomerSignupData) => {
    handleSubmit(data);
  };

  const customerSignupSchema = z.object({
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
        validationSchema={customerSignupSchema as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        <CustomerSignupFormFields
          loading={loading}
          onFormStepChange={onFormStepChange}
        />
      </Provider>
    </>
  );
};
