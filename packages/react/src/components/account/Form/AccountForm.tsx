import { FormSubmitOptions, Provider } from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import { z } from "zod";

import { useConfig } from "@/hooks";
import { Account, AccountCreateInput, AccountUpdateInput } from "@/types";

import { AccountFormFields } from "./AccountFormFields";

type Properties = {
  account?: Account;
  handleCancel: () => void;
  handleSubmit: (
    data: AccountCreateInput | AccountUpdateInput,
    options?: FormSubmitOptions,
  ) => void;
  loading?: boolean;
};

export const AccountForm = ({
  account,
  handleCancel,
  handleSubmit,
  loading,
}: Properties) => {
  const { t } = useTranslation("account");

  const { entity, subdomains } = useConfig();

  const accountValidationSchema = z.object({
    domain: z
      .string()
      .max(255)
      .regex(
        /^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/,
        t("form.validations.domain.invalid"),
      )
      .nullable()
      .optional()
      .or(z.literal("")),
    individual: z.boolean(),
    name: z
      .string()
      .max(255, {
        message: t("form.validations.name.invalid"),
      })
      .min(1, {
        message: t("form.validations.name.required"),
      }),
    registeredNumber: z
      .string()
      .max(255, {
        message: t("form.validations.registeredNumber.invalid"),
      })
      .nullable(),
    slug:
      subdomains === "required"
        ? z
            .string()
            .regex(
              /^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/,
              t("form.validations.slug.invalid"),
            )
        : z
            .string()
            .regex(
              /^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/,
              t("form.validations.slug.invalid"),
            )
            .nullable()
            .optional()
            .or(z.literal("")),
    taxId: z
      .string()
      .max(255, {
        message: t("form.validations.taxId.invalid"),
      })
      .nullable(),
    useSeparateDatabase: z.boolean().nullable(),
  });

  return (
    <Provider
      className="account-form"
      defaultValues={{
        individual: account?.individual || entity === "individual", // if entity is individual, default to true
        name: account?.name || "",
        registeredNumber: account?.registeredNumber || "",
        slug: account?.slug || "",
        taxId: account?.taxId || "",
        useSeparateDatabase: !!account?.database,
      }}
      onSubmit={handleSubmit}
      validationSchema={accountValidationSchema}
    >
      <AccountFormFields
        handleCancel={handleCancel}
        isEditForm={!!account}
        loading={loading}
      />
    </Provider>
  );
};
