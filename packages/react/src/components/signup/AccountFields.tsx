import {
  SwitchInput,
  TextInput,
  useFormContext,
} from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import { useEffect } from "react";

import { useConfig } from "@/hooks";

export const AccountFields = () => {
  const { t } = useTranslation("accounts");

  const { entity, multiDatabase, subdomains } = useConfig();

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
  }, [slug, setValue]);

  const renderEntityFields = () => {
    if (entity === "both") {
      return (
        <>
          <SwitchInput
            label={t("signup.fields.individual")}
            name="individual"
          />
          {!individual && (
            <>
              <TextInput
                label={t("signup.fields.registeredNumber")}
                name="registeredNumber"
              />
              <TextInput label={t("signup.fields.taxId")} name="taxId" />
            </>
          )}
        </>
      );
    }

    if (entity === "organization") {
      return (
        <>
          <TextInput
            label={t("signup.fields.registeredNumber")}
            name="registeredNumber"
          />
          <TextInput label={t("signup.fields.taxId")} name="taxId" />
        </>
      );
    }

    return null;
  };

  return (
    <>
      <TextInput label={t("signup.fields.name")} name="name" />
      {renderEntityFields()}
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
