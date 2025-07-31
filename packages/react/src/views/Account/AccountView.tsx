import { useTranslation } from "@prefabs.tech/react-i18n";
import { Button, Page, Tag } from "@prefabs.tech/react-ui";
import { useNavigate, useParams } from "react-router-dom";

import { useConfig, useGetAccountQuery } from "@/hooks";

import { AccountShow, AccountTab } from "./_components";
import { DEFAULT_PATHS } from "../../constants";

type Properties = {
  showToolbar?: boolean;
  id?: string;
  tabs?: Array<AccountTab>;
  activeKey?: string;
  persistState?: boolean;
  visibleTabs?: Array<string>;
  onVisibleTabsChange?: (visibleTabs: Array<string>) => void;
};

export const AccountViewPage = ({
  showToolbar,
  ...accountShowOptions
}: Properties) => {
  const { t } = useTranslation("account");

  const { entity } = useConfig();

  const parameters = useParams();
  const navigate = useNavigate();

  const { data, loading } = useGetAccountQuery(parameters.id!);

  const renderTitleTag = () => {
    if (entity !== "both") {
      return null;
    }

    if (data?.individual) {
      return <Tag label={t("form.fields.type.options.individual")} />;
    }

    return (
      <Tag label={t("form.fields.type.options.organization")} color="green" />
    );
  };

  return (
    <Page
      className="account-show"
      toolbar={
        showToolbar && (
          <>
            <Button
              onClick={() => navigate(DEFAULT_PATHS.ACCOUNTS)}
              iconLeft={<i className="pi pi-chevron-left"></i>}
              variant="textOnly"
              label={t("toolbar.back")}
            ></Button>
            <Button
              onClick={() => {
                navigate(
                  DEFAULT_PATHS.ACCOUNTS_EDIT.replace(
                    ":id",
                    parameters.id || "",
                  ),
                );
              }}
              label={t("toolbar.edit")}
            ></Button>
          </>
        )
      }
      titleTag={renderTitleTag()}
      title={data?.name}
      loading={loading}
    >
      {data && <AccountShow account={data} {...accountShowOptions} />}
    </Page>
  );
};
