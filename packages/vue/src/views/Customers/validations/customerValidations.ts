import { z } from "zod";
import { useI18n } from "@dzangolab/vue3-i18n";
import { useTranslations } from "../../../index";
import type { SaasConfig } from "../../../types/config";

export const createValidationSchemas = () => {
  const messages = useTranslations();
  const { t } = useI18n({ messages });

  const createSlugSchema = (saasConfig: SaasConfig) => {
    const baseSchema = z
      .string()
      .regex(/^(?!.*-+$)[\da-z][\da-z-]{0,23}([\da-z])?$/, {
        message: t("customers.form.validations.slug.invalid"),
      });

    return saasConfig.subdomains === "required"
      ? baseSchema
      : baseSchema.or(z.literal(""));
  };

  const domainSchema = z
    .string()
    .max(255)
    .regex(/^([\da-z]([\da-z-]{0,61}[\da-z])?\.)+[a-z]{2,}$/, {
      message: t("customers.form.validations.domain.invalid"),
    })
    .or(z.literal(""));

  const nameSchema = z
    .string()
    .min(1, { message: t("customers.form.validations.name.required") })
    .max(255, { message: t("customers.form.validations.name.invalid") });

  const registeredNumberSchema = z
    .string()
    .max(255, {
      message: t("customers.form.validations.registeredNumber.invalid"),
    })
    .or(z.literal(""));

  const taxIdSchema = z
    .string()
    .max(255, { message: t("customers.form.validations.taxId.invalid") })
    .or(z.literal(""));

  return {
    createSlugSchema,
    domainSchema,
    nameSchema,
    registeredNumberSchema,
    taxIdSchema,
  };
};
