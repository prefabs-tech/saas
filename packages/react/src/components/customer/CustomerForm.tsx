import { FormActions, Provider, TextInput } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";

import { CustomerType } from "../../types";

interface Properties {
  customer?: CustomerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (customer: CustomerType) => void;
  onCancel: () => void;
}

export const CustomerForm = ({ customer, onSubmit, onCancel }: Properties) => {
  const { t } = useTranslation("customers");

  return (
    <Provider
      onSubmit={onSubmit}
      defaultValues={customer}
      className="customer-form"
    >
      <TextInput
        label={t("customer.form.fields.billingAddress")}
        name="billingAddress"
      />
      {!customer?.individual && (
        <TextInput label={t("customer.form.fields.taxId")} name="taxId" />
      )}
      <FormActions
        actions={[
          {
            id: "cancel",
            label: t("customer.form.actions.cancel"),
            type: "button",
            onClick: onCancel,
          },
          {
            id: "submit",
            label: t("customer.form.actions.submit"),
          },
        ]}
        alignment="right"
      />
    </Provider>
  );
};
