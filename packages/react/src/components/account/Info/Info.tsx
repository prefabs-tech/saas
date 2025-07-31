import { useTranslation } from "@prefabs.tech/react-i18n";
import { Data, GridContainer, LoadingIcon } from "@prefabs.tech/react-ui";

import { useConfig, useGetAccountQuery } from "@/hooks";
import { checkIsAdminApp } from "@/utils/common";

interface Properties {
  accountId: string;
}

export const AccountInfo = ({ accountId }: Properties) => {
  const { t } = useTranslation("account");

  const { multiDatabase, subdomains } = useConfig();

  const isAdminApp = checkIsAdminApp();

  const { data: account, loading } = useGetAccountQuery(accountId);

  if (loading || !account) {
    return <LoadingIcon />;
  }

  return (
    <GridContainer>
      {!account.individual && (
        <>
          <Data caption={t("form.fields.name")} value={account.name}></Data>
          <Data
            caption={t("form.fields.registeredNumber")}
            value={account.registeredNumber || "-"}
          ></Data>
          <Data caption={t("form.fields.taxId")} value={account.taxId}></Data>
        </>
      )}

      {subdomains !== "disabled" && (
        <>
          <Data
            caption={t("form.fields.slug")}
            value={account.slug || "-"}
          ></Data>
          <Data
            caption={t("form.fields.domain")}
            value={account.domain || "-"}
          ></Data>
          {isAdminApp && multiDatabase && account.database && (
            <Data
              caption={t("form.fields.database")}
              value={account.database}
            ></Data>
          )}
        </>
      )}
    </GridContainer>
  );
};
