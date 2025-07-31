import { useTranslation } from "@prefabs.tech/react-i18n";
import { Page, Tag } from "@prefabs.tech/react-ui";

import { useGetMyAccountQuery } from "@/hooks";

import { AccountShow } from "./_components";

export const AccountSettingsPage = () => {
  const { t } = useTranslation("account");

  const { data, loading } = useGetMyAccountQuery();

  return (
    <Page
      className="account-show account-settings"
      titleTag={
        data?.individual ? (
          <Tag label={t("form.fields.type.options.individual")} />
        ) : (
          <Tag
            label={t("form.fields.type.options.organization")}
            color="green"
          />
        )
      }
      title={data?.name}
      loading={loading}
    >
      {data && <AccountShow account={data} />}
    </Page>
  );
};
