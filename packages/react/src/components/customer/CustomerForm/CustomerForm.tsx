import { FormSubmitOptions, Provider } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { z } from "zod";

import { CustomerFormFields } from "./CustomerFormFields";
import { CustomerType } from "@/types";

type Properties = {
  customer?: CustomerType;
  loading?: boolean;
  handleCancel: () => void;
  handleSubmit: (data: CustomerType, options?: FormSubmitOptions) => void;
};

export const CustomerForm = ({
  customer,
  loading,
  handleCancel,
  handleSubmit,
}: Properties) => {
  const { t } = useTranslation("customers");

  const customerValidationSchema: any = z.object({
    name: z
      .string()
      .max(255, {
        message: t("customer.form.validations.name.invalid"),
      })
      .nonempty({
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
  });

  return (
    <Provider
      onSubmit={handleSubmit}
      defaultValues={{
        domain: customer?.domain || "",
        individual: customer?.individual || false,
        name: customer?.name || "",
        organizationName: customer?.organizationName || "",
        registeredNumber: customer?.registeredNumber || "",
        slug: customer?.slug || "",
        taxId: customer?.taxId || "",
        useSeparateDatabase: customer?.database || false,
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
