import { useTranslation } from "@dzangolab/react-i18n";
import { Data, GridContainer, LoadingIcon } from "@dzangolab/react-ui";

import { useConfig, useGetAccountQuery } from "@/hooks";

interface Properties {
  accountId: string;
}

export const AccountInfo = ({ accountId }: Properties) => {
  const { t } = useTranslation("account");

  const { multiDatabase, subdomains } = useConfig();

  const { data: account, loading } = useGetAccountQuery(accountId);

  if (loading || !account) {
    return <LoadingIcon />;
  }

  return (
    <GridContainer>
      {!account.individual && (
        <>
          <Data label={t("form.fields.name")} value={account.name}></Data>
          <Data
            label={t("form.fields.registeredNumber")}
            value={account.registeredNumber || "-"}
          ></Data>
          <Data label={t("form.fields.taxId")} value={account.taxId}></Data>
        </>
      )}

      {subdomains !== "disabled" && (
        <>
          <Data
            label={t("form.fields.slug")}
            value={account.slug || "-"}
          ></Data>
          <Data
            label={t("form.fields.domain")}
            value={account.domain || "-"}
          ></Data>
          {multiDatabase && account.database && (
            <Data
              label={t("form.fields.database")}
              value={account.database}
            ></Data>
          )}
        </>
      )}
    </GridContainer>
  );
};
