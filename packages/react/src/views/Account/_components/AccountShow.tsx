import { useTranslation } from "@prefabs.tech/react-i18n";
import { TabView } from "@prefabs.tech/react-ui";

import {
  AccountInfo,
  AccountInvitationsTable,
  AccountUsersTable,
} from "@/components/account";
import { Account } from "@/types";

export type AccountShowProperties = {
  account: Account;
  activeTab?: string;
  id?: string;
  onVisibleTabsChange?: (visibleTabs: Array<string>) => void;
  persistState?: boolean;
  tabs?: Array<AccountTab>;
  visibleTabs?: Array<string>;
};

export type AccountTab = {
  children?: React.ReactNode;
  display?: boolean;
  key: string;
  label?: string;
};

export const AccountShow = ({
  account,
  activeTab = "info",
  id = "account-show",
  tabs = [],
  visibleTabs = ["info", "users", "invitations"],
  ...others
}: AccountShowProperties) => {
  const { t } = useTranslation("account");

  const defaultTabs = [
    {
      children: <AccountInfo accountId={account.id} />,
      key: "info",
      label: t("info.title"),
    },
    {
      children: <AccountUsersTable accountId={account.id} />,
      key: "users",
      label: t("users.title"),
    },
    {
      children: <AccountInvitationsTable accountId={account.id} />,
      key: "invitations",
      label: t("invitations.title"),
    },
  ];

  const allTabs = [...defaultTabs, ...tabs];
  const mergedTabs = allTabs.reduce((accumulator, tab) => {
    const existingTab = accumulator.find((t) => t.key === tab.key);

    if (existingTab) {
      Object.assign(existingTab, tab);
    } else {
      accumulator.push(tab);
    }

    return accumulator;
  }, [] as Array<AccountTab>);

  const filteredTabs = mergedTabs.filter(
    (tab) => tab.display !== false && tab.children && tab.label,
  );

  const activeTabKey = filteredTabs.find((tab) => tab.key === activeTab)
    ? activeTab
    : filteredTabs[0]?.key;

  return (
    <TabView
      activeKey={activeTabKey}
      id={id}
      tabs={filteredTabs as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      visibleTabs={visibleTabs}
      {...others}
    ></TabView>
  );
};
