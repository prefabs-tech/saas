import { emailSchema, passwordSchema, Provider } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { z } from "zod";

import { CustomerSignupData } from "@/types/customer";

import { CustomerSignupFormFields } from "./CustomerSignupFormFields";

export type CustomerSignupProperties = {
  loading?: boolean;
  showTermsAndConditions?: boolean;
  termsAndConditionsLabel?: string;
  handleSubmit: (formData: CustomerSignupData) => void;
  onFormStepChange?: (activeStep: number) => void;
};

export const CustomerSignupForm = ({
  loading,
  showTermsAndConditions,
  termsAndConditionsLabel,
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
        message: t("customer.form.validations.name.invalid"),
      })
      .min(1, {
        message: t("customer.form.validations.name.required"),
      }),
    individual: z.boolean(),
    organizationName: z
      .string()
      .max(255, {
        message: t("customer.form.validations.organizationName.invalid"),
      })
      .nullable(),
    registeredNumber: z
      .string()
      .max(255, {
        message: t("customer.form.validations.registeredNumber.invalid"),
      })
      .nullable(),
    taxId: z
      .string()
      .max(255, {
        message: t("customer.form.validations.taxId.invalid"),
      })
      .nullable(),
    slug: z
      .string()
      .max(24, {
        message: t("customer.form.validations.slug.invalid"),
      })
      .nullable(),
    useSeparateDatabase: z.boolean().nullable(),
    domain: z
      .string()
      .max(253, {
        message: t("customer.form.validations.domain.invalid"),
      })
      .nullable(),

    email: emailSchema({
      invalid: t("customer.form.validations.email.invalid"),
      required: t("customer.form.validations.email.required"),
    }),
    password: passwordSchema(
      {
        required: t("customer.form.validations.password.required"),
        weak: t("customer.form.validations.password.invalid"),
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
      .min(1, t("customer.form.validations.configmPassword.required")),
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
        className="customer-signup"
        validationSchema={customerSignupSchema as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        <CustomerSignupFormFields
          loading={loading}
          showTermsAndConditions={showTermsAndConditions}
          termsAndConditionsLabel={termsAndConditionsLabel}
          onFormStepChange={onFormStepChange}
        />
      </Provider>
    </>
  );
};
