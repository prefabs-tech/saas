import * as z from "zod";

export const createEmailSchema = (t: (key: string) => string) =>
  z.string().email(t("customers.invitations.form.validation.email"));

export const createRoleSchema = (t: (key: string) => string) =>
  z.string().min(1, t("customers.invitations.form.validation.role"));
