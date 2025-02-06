import {
  emailSchema,
  FormActions,
  passwordSchema,
  Provider,
} from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { useState } from "react";
import { z } from "zod";

import { useConfig } from "@/hooks";
import { CustomerSignupData } from "@/types/customer";

import { CustomerFields } from "./CustomerFields";
import { UserFields } from "./UserFields";

export type CustomerSignupProperties = {
  loading?: boolean;
  handleSubmit: (formData: CustomerSignupData) => void;
};

export const CustomerSignupForm = ({
  loading,
  handleSubmit,
}: CustomerSignupProperties) => {
  const { t } = useTranslation("accounts");

  const [activeIndex, setActiveIndex] = useState(0);

  const { subdomains } = useConfig();

  const customerSchema = z.object({
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
    slug:
      subdomains === "required"
        ? z
            .string()
            .regex(
              /^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/,
              t("signup.validations.slug.invalid"),
            )
        : z
            .string()
            .regex(
              /^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/,
              t("signup.validations.slug.invalid"),
            )
            .nullable()
            .optional()
            .or(z.literal("")),
    useSeparateDatabase: z.boolean().nullable(),
  });

  const userSchema = z.object({
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

  const customerSignupSchema = customerSchema.merge(userSchema).refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: t("signup.validations.configmPassword.mustMatch"),
      path: ["confirmPassword"],
    },
  );

  const onSubmit = (data: CustomerSignupData) => {
    if (activeIndex === 1) {
      handleSubmit(data);
    } else {
      setActiveIndex(1);
    }
  };

  const onCancel = () => {
    setActiveIndex(0);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formActions: any = [
    {
      label:
        activeIndex === 1
          ? t("signup.actions.submit")
          : t("signup.actions.next"),
      type: "submit",
    },
  ];

  if (activeIndex > 0) {
    formActions.unshift({
      id: "cancel",
      label: t("signup.actions.previous"),
      severity: "secondary",
      type: "button",
      variant: "outlined",
      onClick: onCancel,
    });
  }

  return (
    <>
      <Provider
        onSubmit={onSubmit}
        defaultValues={{
          // customer details
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
        validationSchema={
          activeIndex === 0 ? customerSchema : customerSignupSchema
        }
      >
        {activeIndex === 0 && <CustomerFields />}
        {activeIndex === 1 && <UserFields />}
        <FormActions actions={formActions} alignment="fill" loading={loading} />
      </Provider>
    </>
  );
};
