import { FormSubmitOptions, Provider } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { z } from "zod";

import { useConfig } from "@/hooks";
import { Customer, CustomerCreateInput, CustomerUpdateInput } from "@/types";

import { CustomerFormFields } from "./CustomerFormFields";

type Properties = {
  customer?: Customer;
  loading?: boolean;
  handleCancel: () => void;
  handleSubmit: (
    data: CustomerCreateInput | CustomerUpdateInput,
    options?: FormSubmitOptions,
  ) => void;
};

export const CustomerForm = ({
  customer,
  loading,
  handleCancel,
  handleSubmit,
}: Properties) => {
  const { t } = useTranslation("customers");

  const { subdomains } = useConfig();

  const customerValidationSchema = z.object({
    name: z
      .string()
      .max(255, {
        message: t("form.validations.name.invalid"),
      })
      .min(1, {
        message: t("form.validations.name.required"),
      }),
    individual: z.boolean(),
    organizationName: z
      .string()
      .max(255, {
        message: t("form.validations.organizationName.invalid"),
      })
      .nullable(),
    registeredNumber: z
      .string()
      .max(255, {
        message: t("form.validations.registeredNumber.invalid"),
      })
      .nullable(),
    taxId: z
      .string()
      .max(255, {
        message: t("form.validations.taxId.invalid"),
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
    useSeparateDatabase: z.boolean().nullable(),
  });

  return (
    <Provider
      onSubmit={handleSubmit}
      defaultValues={{
        individual: customer?.individual || false,
        name: customer?.name || "",
        organizationName: customer?.organizationName || "",
        registeredNumber: customer?.registeredNumber || "",
        slug: customer?.slug || "",
        taxId: customer?.taxId || "",
        useSeparateDatabase: !!customer?.database,
      }}
      className="customer-form"
      validationSchema={customerValidationSchema}
    >
      <CustomerFormFields
        handleCancel={handleCancel}
        isEditForm={!!customer}
        loading={loading}
      />
    </Provider>
  );
};
