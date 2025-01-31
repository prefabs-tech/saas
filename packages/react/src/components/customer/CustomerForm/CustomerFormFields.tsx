import {
  FormActions,
  SwitchInput,
  TextInput,
  useFormContext,
} from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { useEffect } from "react";

type Properties = {
  isEditForm?: boolean;
  loading?: boolean;
  handleCancel: () => void;
};

export const CustomerFormFields = ({
  isEditForm,
  loading,
  handleCancel,
}: Properties) => {
  const { t } = useTranslation("customers");

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors, submitCount },
    watch,
    setValue,
  } = useFormContext();

  const individual = watch("individual");
  const slug = watch("slug");

  useEffect(() => {
    if (!slug) {
      setValue("useSeparateDatabase", false);
    }
  }, [slug]);

  const formActions: any = [
    {
      label: t("customer.form.actions.save"),
    },

    {
      id: "cancel",
      label: t("customer.form.actions.cancel"),
      severity: "secondary",
      type: "button",
      variant: "outlined",
      onClick: handleCancel,
    },
  ];

  return (
    <>
      <TextInput label={t("customer.form.fields.name")} name="name" />
      {!isEditForm && (
        <SwitchInput
          label={t("customer.form.fields.individual")}
          name="individual"
        />
      )}
      {(!individual || (isEditForm && !individual)) && (
        <fieldset>
          <TextInput
            label={t("customer.form.fields.organizationName")}
            name="organizationName"
          />
          <TextInput
            label={t("customer.form.fields.registeredNumber")}
            name="registeredNumber"
          />
          <TextInput label={t("customer.form.fields.taxId")} name="taxId" />
        </fieldset>
      )}
      <TextInput
        label={t("customer.form.fields.slug")}
        name="slug"
        disabled={isEditForm}
      />
      {slug && (
        <SwitchInput
          label={t("customer.form.fields.useSeparateDb")}
          name="useSeparateDatabase"
          disabled={isEditForm}
        />
      )}
      <TextInput label={t("customer.form.fields.domain")} name="domain" />
      <FormActions actions={formActions} alignment="left" loading={loading} />
    </>
  );
};
