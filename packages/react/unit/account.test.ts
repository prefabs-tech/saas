import { describe, expect, it } from "vitest";

import { prepareSignupData } from "@/utils/account";

import type { AccountSignupData, UserSignupData } from "@/types/account";

describe("prepareSignupData", () => {
  it("creates user signup payload when accountSignup=false", () => {
    const payload = prepareSignupData({
      accountSignup: false,
      data: { email: "a@b.com", password: "secret" } satisfies UserSignupData,
    });

    expect(payload).toEqual({
      formFields: [
        { id: "email", value: "a@b.com" },
        { id: "password", value: "secret" },
      ],
    });
  });

  it("nulls company fields when individual=true", () => {
    const payload = prepareSignupData({
      data: {
        email: "a@b.com",
        password: "secret",
        name: "Name",
        individual: true,
        registeredNumber: "RN",
        taxId: "TAX",
        slug: "s",
        useSeparateDatabase: true,
      } satisfies AccountSignupData,
    });

    expect(payload.accountFormFields).toEqual(
      expect.arrayContaining([
        { id: "registeredNumber", value: null },
        { id: "taxId", value: null },
      ]),
    );
  });

  it("forces useSeparateDatabase=false when slug is missing", () => {
    const payload = prepareSignupData({
      data: {
        email: "a@b.com",
        password: "secret",
        name: "Name",
        individual: false,
        registeredNumber: "RN",
        taxId: "TAX",
        slug: "",
        useSeparateDatabase: true,
      } satisfies AccountSignupData,
    });

    expect(payload.accountFormFields).toEqual(
      expect.arrayContaining([{ id: "useSeparateDatabase", value: false }]),
    );
  });
});
