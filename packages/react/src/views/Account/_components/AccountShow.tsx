import { useTranslation } from "@prefabs.tech/react-i18n";
import { TabView } from "@prefabs.tech/react-ui";

import {
  AccountInfo,
  AccountInvitationsTable,
  AccountUsersTable,
} from "@/components/account";
import { Account } from "@/types";

export type AccountTab = {
  key: string;
  label?: string;
  children?: React.ReactNode;
  display?: boolean;
};

type Properties = {
  account: Account;
  id?: string;
  tabs?: Array<AccountTab>;
  activeKey?: string;
  persistState?: boolean;
  visibleTabs?: Array<string>;
  onVisibleTabsChange?: (visibleTabs: Array<string>) => void;
};

export const AccountShow = ({
  id = "account-show",
  account,
  tabs = [],
  activeKey = "info",
  visibleTabs = ["info", "users", "invitations"],
  ...others
}: Properties) => {
  const { t } = useTranslation("account");

  const defaultTabs = [
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

  const activeTabKey = filteredTabs.find((tab) => tab.key === activeKey)
    ? activeKey
    : filteredTabs[0]?.key;

  return (
    <TabView
      id={id}
      tabs={filteredTabs as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      activeKey={activeTabKey}
      visibleTabs={visibleTabs}
      {...others}
    ></TabView>
  );
};
