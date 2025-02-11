import { useTranslation } from "@dzangolab/react-i18n";
import { Button, Data, GridContainer, Tag } from "@dzangolab/react-ui";

import { Customer } from "@/types";

type Properties = {
  account: Customer;
  active: boolean;
  loading?: boolean;
  onSwitch: () => void;
};

export const Account = ({ account, active, loading, onSwitch }: Properties) => {
  const { t } = useTranslation("accounts");

  return (
    <div className={`account${active ? " highlight" : ""}`}>
      <div className="header">
        {account.organizationName || account.name}
        {active ? (
          <Tag label={t("account.active")}></Tag>
        ) : (
          <Button
            onClick={onSwitch}
            loading={loading}
            size="small"
            variant="outlined"
          >
            {t("account.actions.switch")}
          </Button>
        )}
      </div>
      {!account.individual && (
        <GridContainer>
          <Data label={t("account.name")} value={account.name}></Data>
          <Data
            label={t("account.registeredNumber")}
            value={account.registeredNumber || "-"}
          ></Data>
          <Data label={t("account.taxId")} value={account.taxId}></Data>
        </GridContainer>
      )}
    </div>
  );
};
