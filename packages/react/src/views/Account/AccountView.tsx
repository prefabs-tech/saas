import { useTranslation } from "@prefabs.tech/react-i18n";
import { Button, Page, Tag } from "@prefabs.tech/react-ui";
import { useNavigate, useParams } from "react-router-dom";

import { useConfig, useGetAccountQuery } from "@/hooks";

import { DEFAULT_PATHS } from "../../constants";
import { AccountShow, AccountShowProperties } from "./_components";

type Properties = Omit<AccountShowProperties, "account"> & {
  showToolbar?: boolean;
};

export const AccountViewPage = ({
  showToolbar = true,
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
      <Tag color="green" label={t("form.fields.type.options.organization")} />
    );
  };

  return (
    <Page
      className="account-show"
      loading={loading}
      title={data?.name}
      titleTag={renderTitleTag()}
      toolbar={
        showToolbar && (
          <>
            <Button
              iconLeft={<i className="pi pi-chevron-left"></i>}
              label={t("toolbar.back")}
              onClick={() => navigate(DEFAULT_PATHS.ACCOUNTS)}
              variant="textOnly"
            ></Button>

            <Button
              iconLeft={"pi pi-pen-to-square"}
              onClick={() => {
                navigate(
                  DEFAULT_PATHS.ACCOUNTS_EDIT.replace(
                    ":id",
                    parameters.id || "",
                  ),
                );
              }}
              title={t("toolbar.edit")}
            />
          </>
        )
      }
    >
      {data && <AccountShow account={data} {...accountShowOptions} />}
    </Page>
  );
};
