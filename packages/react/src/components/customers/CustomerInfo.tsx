import { useTranslation } from "@dzangolab/react-i18n";
import { Data, GridContainer } from "@dzangolab/react-ui";

import { useConfig } from "@/hooks";

import { Customer } from "../../types";

interface Properties {
  customer: Customer;
}

export const CustomerInfo = ({ customer }: Properties) => {
  const { t } = useTranslation("customers");

  const { subdomains } = useConfig();

  return (
    <GridContainer>
      {!customer.individual && (
        <Data label={t("form.fields.name")} value={customer.name}></Data>
      )}
      {subdomains !== "disabled" && (
        <Data label={t("form.fields.slug")} value={customer.slug || "-"}></Data>
      )}
      {!customer.individual && (
        <Data label={t("form.fields.taxId")} value={customer.taxId}></Data>
      )}
    </GridContainer>
  );
};
