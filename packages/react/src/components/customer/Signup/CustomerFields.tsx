import { SwitchInput, TextInput, useFormContext } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { useEffect } from "react";

type Properties = {
  step: number;
};

export const CustomerFields = ({ step }: Properties) => {
  const { t } = useTranslation("accounts");

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

  return (
    <>
      {step === 0 && (
        <TextInput label={t("customer.form.fields.name")} name="name" />
      )}

      {step === 1 && (
        <>
          <p>
            <strong>{t("customer.form.fieldsGroup.accountType")}</strong>
          </p>
          <SwitchInput
            label={t("customer.form.fields.individual")}
            name="individual"
          />
          {!individual && (
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
          )}{" "}
        </>
      )}

      {step === 2 && (
        <>
          <p>
            <strong>{t("customer.form.fieldsGroup.configuration")}</strong>
          </p>
          <TextInput label={t("customer.form.fields.slug")} name="slug" />
          <SwitchInput
            label={t("customer.form.fields.useSeparateDb")}
            name="useSeparateDatabase"
            disabled={!slug}
          />
          <TextInput label={t("customer.form.fields.domain")} name="domain" />
        </>
      )}

      {/* <FormActions actions={formActions} alignment="left" /> */}
    </>
  );
};
