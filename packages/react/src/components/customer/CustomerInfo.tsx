import { useTranslation } from "@dzangolab/react-i18n";

import { Customer } from "../../types";

interface Properties {
  data?: Customer;
}

export const CustomerInfo = ({ data }: Properties) => {
  const { t } = useTranslation("customers");

  return (
    <div className="customer-details">
      <div className="customer-detail billing-address">
        <span className="label">
          {t("customer.form.fields.billingAddress")}
        </span>
      </div>
      {data && !data.individual ? (
        <div className="customer-detail tax-id">
          <span className="label">{t("customer.form.fields.taxId")}</span>
          <span className="value">{data?.taxId}</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
