import { useTranslation } from "@prefabs.tech/react-i18n";
import { LoadingIcon, Page } from "@prefabs.tech/react-ui";
import { useEffect, useState } from "react";

import { SaasConfig } from "@/types";

import { doesAccountExist } from "./api";
import AccountsProvider from "./contexts/AccountsProvider";
import ConfigProvider from "./contexts/ConfigProvider";
import { checkIsAdminApp } from "./utils/common";
import { prepareConfig } from "./utils/config";

type SaasWrapperProperties = {
  children: React.ReactNode;
  config: SaasConfig;
  userId?: string;
};

export const SaasWrapper = ({
  children,
  config,
  userId,
}: SaasWrapperProperties) => {
  const [t] = useTranslation("accounts");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    doesAccountExist({ apiBaseUrl: config.apiBaseUrl })
      .then()
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [config.apiBaseUrl]);

  const isAdminApp = checkIsAdminApp();

  if (loading) {
    return <LoadingIcon />;
  }

  if (error) {
    if (error.status === 404) {
      return (
        <Page
          centered
          className="error"
          subtitle={t("unregisteredDomain.message")}
          title={t("unregisteredDomain.title")}
        ></Page>
      );
    } else {
      return (
        <Page
          centered
          className="error"
          subtitle={t("error.message")}
          title={t("error.title")}
        ></Page>
      );
    }
  }

  const _config = prepareConfig(config);

  return (
    <ConfigProvider config={_config}>
      {isAdminApp ? (
        children
      ) : (
        <AccountsProvider config={_config} userId={userId}>
          {children}
        </AccountsProvider>
      )}
    </ConfigProvider>
  );
};
