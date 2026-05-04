import {
  FormActions,
  SwitchInput,
  TextInput,
  useFormContext,
} from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import { useEffect } from "react";

import { useConfig } from "@/hooks";

type Properties = {
  handleCancel: () => void;
  isEditForm?: boolean;
  loading?: boolean;
};

export const AccountFormFields = ({
  handleCancel,
  isEditForm,
  loading,
}: Properties) => {
  const { t } = useTranslation("account");

  const { entity, multiDatabase, subdomains, ui } = useConfig();

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors, submitCount },
    setValue,
    watch,
  } = useFormContext();

  const individual = watch("individual");
  const slug = watch("slug");

  useEffect(() => {
    if (!slug) {
      setValue("useSeparateDatabase", false);
      setValue("domain", "");
    }
  }, [slug, setValue]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formActions: any = [
    {
      label: t("form.actions.save"),
    },

    {
      id: "cancel",
      label: t("form.actions.cancel"),
      onClick: handleCancel,
      severity: "secondary",
      type: "button",
      variant: "outlined",
    },
  ];

  const renderEntityFields = () => {
    if (entity === "both") {
      return (
        <>
          {!isEditForm && (
            <SwitchInput
              label={t("form.fields.type.label")}
              name="individual"
            />
          )}
          {!individual && (
            <>
              <TextInput
                label={t("form.fields.registeredNumber")}
                name="registeredNumber"
              />
              <TextInput label={t("form.fields.taxId")} name="taxId" />
            </>
          )}
        </>
      );
    }

    if (entity === "organization") {
      return (
        <>
          <TextInput
            label={t("form.fields.registeredNumber")}
            name="registeredNumber"
          />
          <TextInput label={t("form.fields.taxId")} name="taxId" />
        </>
      );
    }

    return null;
  };

  return (
    <>
      <TextInput label={t("form.fields.name")} name="name" />
      {renderEntityFields()}
      {subdomains !== "disabled" && (
        <>
          <TextInput label={t("form.fields.slug")} name="slug" />
          <TextInput
            disabled={!slug}
            label={t("form.fields.domain")}
            name="domain"
          />
          {multiDatabase && !isEditForm && (
            <SwitchInput
              disabled={!slug || isEditForm}
              label={t("form.fields.useSeparateDb")}
              name="useSeparateDatabase"
            />
          )}
        </>
      )}
      <FormActions
        actions={formActions}
        alignment={ui?.account?.form?.actionsAlignment}
        loading={loading}
        reverse={ui?.account?.form?.actionsReverse}
      />
    </>
  );
};
