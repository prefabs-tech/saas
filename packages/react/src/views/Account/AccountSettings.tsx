import { useTranslation } from "@prefabs.tech/react-i18n";
import { Page, Tag } from "@prefabs.tech/react-ui";

import { useGetMyAccountQuery } from "@/hooks";

import { AccountShow, AccountShowProperties } from "./_components";

type Properties = Omit<AccountShowProperties, "account">;

export const AccountSettingsPage = ({ ...accountShowOptions }: Properties) => {
  const { t } = useTranslation("account");

  const { data, loading } = useGetMyAccountQuery();

  return (
    <Page
      className="account-show account-settings"
      loading={loading}
      title={data?.name}
      titleTag={
        data?.individual ? (
          <Tag label={t("form.fields.type.options.individual")} />
        ) : (
          <Tag
            color="green"
            label={t("form.fields.type.options.organization")}
          />
        )
      }
    >
      {data && <AccountShow account={data} {...accountShowOptions} />}
    </Page>
  );
};
