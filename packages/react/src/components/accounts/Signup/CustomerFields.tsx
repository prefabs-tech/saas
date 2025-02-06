import { SwitchInput, TextInput, useFormContext } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { useEffect } from "react";

import { useConfig } from "@/hooks";

export const CustomerFields = () => {
  const { t } = useTranslation("accounts");

  const { multiDatabase, subdomains } = useConfig();

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
      <TextInput label={t("signup.fields.name")} name="name" />

      <SwitchInput label={t("signup.fields.individual")} name="individual" />
      {!individual && (
        <>
          <TextInput
            label={t("signup.fields.organizationName")}
            name="organizationName"
          />
          <TextInput
            label={t("signup.fields.registeredNumber")}
            name="registeredNumber"
          />
          <TextInput label={t("signup.fields.taxId")} name="taxId" />
        </>
      )}

      {subdomains !== "disabled" && (
        <>
          <TextInput label={t("signup.fields.slug")} name="slug" />
          {multiDatabase && (
            <SwitchInput
              label={t("signup.fields.useSeparateDb")}
              name="useSeparateDatabase"
              disabled={!slug}
            />
          )}
        </>
      )}
    </>
  );
};
