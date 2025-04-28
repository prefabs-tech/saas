import { useTranslation } from "@dzangolab/react-i18n";
import { Page } from "@dzangolab/react-ui";

export const UnregisteredDomainPage = () => {
  const { t } = useTranslation("accounts");

  return (
    <Page className="unregistered-domain">
      <h1>{t("unregisteredDomain.title")}</h1>
      <p>{t("unregisteredDomain.subtitle")}</p>
    </Page>
  );
};
