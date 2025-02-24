import { useTranslation } from "@dzangolab/react-i18n";
import { Page } from "@dzangolab/react-ui";
import { useParams } from "react-router-dom";

import { useGetAccountQuery } from "@/hooks";

import { AccountForm } from "./_components";

export const AccountEditPage = () => {
  const { t } = useTranslation("account");
  const parameters = useParams();

  const { data, loading } = useGetAccountQuery(parameters.id!);

  return (
    <Page title={t("editTitle")} loading={loading}>
      {data && <AccountForm account={data} />}
    </Page>
  );
};
