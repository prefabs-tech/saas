import { z } from "zod";

export const createEmailSchema = () =>
  z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address");

export const createNameSchema = (isRequired = false) => {
  const schema = z.string().max(100, "Name must be less than 100 characters");
  return isRequired
    ? schema.min(1, "This field is required")
    : schema.optional();
};

export const createPasswordSchema = () =>
  z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    );

export const createConfirmPasswordSchema = (password: string) =>
  z
    .string()
    .min(1, "Please confirm your password")
    .refine((value) => value === password, {
      message: "Passwords do not match",
    });

export const createTermsSchema = () =>
  z.boolean().refine((value) => value === true, {
    message: "Please agree to the terms and conditions",
  });
