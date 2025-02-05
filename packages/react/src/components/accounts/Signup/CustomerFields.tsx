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
      {step === 0 && <TextInput label={t("signup.fields.name")} name="name" />}

      {step === 1 && (
        <>
          <p>
            <strong>{t("signup.fieldsGroup.accountType")}</strong>
          </p>
          <SwitchInput
            label={t("signup.fields.individual")}
            name="individual"
          />
          {!individual && (
            <fieldset>
              <TextInput
                label={t("signup.fields.organizationName")}
                name="organizationName"
              />
              <TextInput
                label={t("signup.fields.registeredNumber")}
                name="registeredNumber"
              />
              <TextInput label={t("signup.fields.taxId")} name="taxId" />
            </fieldset>
          )}{" "}
        </>
      )}

      {step === 2 && (
        <>
          <p>
            <strong>{t("signup.fieldsGroup.configuration")}</strong>
          </p>
          <TextInput label={t("signup.fields.slug")} name="slug" />
          <SwitchInput
            label={t("signup.fields.useSeparateDb")}
            name="useSeparateDatabase"
            disabled={!slug}
          />
          <TextInput label={t("signup.fields.domain")} name="domain" />
        </>
      )}
    </>
  );
};
