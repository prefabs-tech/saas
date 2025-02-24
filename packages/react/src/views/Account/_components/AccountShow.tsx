import { useTranslation } from "@dzangolab/react-i18n";
import { TabView } from "@dzangolab/react-ui";

import {
  AccountInfo,
  AccountInvitationsTable,
  AccountUsersTable,
} from "@/components/account";
import { Account } from "@/types";

type Properties = {
  account: Account;
};

export const AccountShow = ({ account }: Properties) => {
  const { t } = useTranslation("account");

  const tabs = [
    {
      key: "info",
      label: t("info.title"),
      children: <AccountInfo accountId={account.id} />,
    },
    {
      key: "users",
      label: t("users.title"),
      children: <AccountUsersTable accountId={account.id} />,
    },
    {
      key: "invitations",
      label: t("invitations.title"),
      children: <AccountInvitationsTable accountId={account.id} />,
    },
  ];

  return (
    <TabView
      tabs={tabs}
      id="account-show"
      activeKey="info"
      visibleTabs={["info", "users", "invitations"]}
      onVisibleTabsChange={() => {}}
      persistState={false}
    ></TabView>
  );
};
