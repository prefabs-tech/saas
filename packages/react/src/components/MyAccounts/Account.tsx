import { useTranslation } from "@prefabs.tech/react-i18n";
import { Button, Tag } from "@prefabs.tech/react-ui";

import { Account as AccountType } from "@/types";

type Properties = {
  account: AccountType;
  active: boolean;
  loading?: boolean;
  onSwitch: () => void;
};

export const Account = ({ account, active, loading, onSwitch }: Properties) => {
  const { t } = useTranslation("accounts");

  return (
    <div className={`account${active ? " highlight" : ""}`}>
      <div className="header">
        {account.name}
        <div className="actions">
          {active ? (
            <Tag label={t("account.active")}></Tag>
          ) : (
            <Button
              iconLeft="pi pi-arrow-right-arrow-left"
              loading={loading}
              onClick={onSwitch}
              severity="secondary"
              size="small"
              variant="outlined"
            >
              {t("account.actions.switch")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
