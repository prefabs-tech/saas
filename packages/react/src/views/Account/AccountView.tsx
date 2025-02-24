import { useTranslation } from "@dzangolab/react-i18n";
import { Button, Page, Tag } from "@dzangolab/react-ui";
import { useNavigate, useParams } from "react-router-dom";

import { useGetAccountQuery } from "@/hooks";

import { AccountShow } from "./_components";
import { DEFAULT_PATHS } from "../../constants";

export const AccountViewPage = () => {
  const { t } = useTranslation("account");

  const parameters = useParams();
  const navigate = useNavigate();

  const { data, loading } = useGetAccountQuery(parameters.id!);

  return (
    <Page
      className="account-show"
      toolbar={
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
                DEFAULT_PATHS.ACCOUNTS_EDIT.replace(":id", parameters.id || ""),
              );
            }}
            label={t("toolbar.edit")}
          ></Button>
        </>
      }
      titleTag={
        data?.individual ? (
          <Tag label={t("form.fields.type.options.individual")} />
        ) : (
          <Tag
            label={t("form.fields.type.options.organization")}
            color="green"
          />
        )
      }
      title={data?.name}
      loading={loading}
    >
      {data && <AccountShow account={data} />}
    </Page>
  );
};
