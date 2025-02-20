import { useTranslation } from "@dzangolab/react-i18n";
import { Button, Tag } from "@dzangolab/react-ui";

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
    </div>
  );
};
