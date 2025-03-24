import { useTranslation } from "@dzangolab/react-i18n";
import { Button, Tag } from "@dzangolab/react-ui";
import { useNavigate } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { Account as AccountType } from "@/types";

type Properties = {
  account: AccountType;
  active: boolean;
  loading?: boolean;
  onSwitch: () => void;
};

export const Account = ({ account, active, loading, onSwitch }: Properties) => {
  const { t } = useTranslation("accounts");
  const navigate = useNavigate();

  return (
    <div className={`account${active ? " highlight" : ""}`}>
      <div className="header">
        {account.name}
        <div className="actions">
          {active ? (
            <Tag label={t("account.active")}></Tag>
          ) : (
            <Button
              onClick={onSwitch}
              loading={loading}
              iconLeft="pi pi-arrow-right-arrow-left"
              size="small"
              variant="outlined"
              severity="secondary"
            >
              {t("account.actions.switch")}
            </Button>
          )}
          <Button
            onClick={() => {
              navigate(DEFAULT_PATHS.MY_ACCOUNT.replace(":id", account.id));
            }}
            iconLeft="pi pi-cog"
            size="small"
            title={t("account.actions.view")}
          ></Button>
        </div>
      </div>
    </div>
  );
};
