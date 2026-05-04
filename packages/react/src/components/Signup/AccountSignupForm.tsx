import {
  emailSchema,
  passwordSchema,
  Provider,
} from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import { useState } from "react";
import { z } from "zod";

import { useConfig } from "@/hooks";
import { AccountSignupData } from "@/types/account";

import { AccountFields } from "./AccountFields";
import { SignupFormActions } from "./SignupFormActions";
import { UserFields } from "./UserFields";

export type AccountSignupProperties = {
  handleSubmit: (formData: AccountSignupData) => void;
  loading?: boolean;
};

export const AccountSignupForm = ({
  handleSubmit,
  loading,
}: AccountSignupProperties) => {
  const { t } = useTranslation("accounts");

  const [activeIndex, setActiveIndex] = useState(0);

  const { accounts, entity, subdomains } = useConfig();
  const { termsAndConditionsUrl } = accounts?.signup || {};

  const accountSchema = z.object({
    individual: z.boolean(),
    name: z
      .string()
      .max(255, {
        message: t("signup.validations.name.invalid"),
      })
      .min(1, {
        message: t("signup.validations.name.required"),
      }),
    registeredNumber: z
      .string()
      .max(255, {
        message: t("signup.validations.registeredNumber.invalid"),
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
    taxId: z
      .string()
      .max(255, {
        message: t("signup.validations.taxId.invalid"),
      })
      .nullable(),
    useSeparateDatabase: z.boolean().nullable(),
  });

  const userSchema = z.object({
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
  });

  const accountSignupSchema = accountSchema.merge(userSchema).refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: t("signup.validations.confirmPassword.mustMatch"),
      path: ["confirmPassword"],
    },
  );

  const onSubmit = (data: AccountSignupData) => {
    if (activeIndex === 1) {
      handleSubmit(data);
    } else {
      setActiveIndex(1);
    }
  };

  const onCancel = () => {
    setActiveIndex(0);
  };

  return (
    <>
      <Provider
        className="account-signup"
        defaultValues={{
          confirmPassword: "",
          // user fields
          email: "",
          // account fields
          individual: entity === "individual", // if entity is individual, default to true
          name: "",
          password: "",
          registeredNumber: "",

          slug: "",
          taxId: "",
          useSeparateDatabase: false,
        }}
        onSubmit={onSubmit}
        validationSchema={
          activeIndex === 0 ? accountSchema : accountSignupSchema
        }
      >
        {activeIndex === 0 && <AccountFields />}
        {activeIndex === 1 && <UserFields />}
        <SignupFormActions
          cancelButtonOptions={{
            label: t("signup.actions.previous"),
            onClick: onCancel,
          }}
          loading={loading}
          showCancel={activeIndex === 1}
          submitButtonOptions={{
            disabled: false, // FIXME disable submit only when user fields are shown
            label:
              activeIndex === 1
                ? t("signup.actions.submit")
                : t("signup.actions.next"),
          }}
        />
      </Provider>
    </>
  );
};
