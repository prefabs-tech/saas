import { describe, expect, it, vi } from "vitest";

import { prepareSignupData } from "@/utils/account";
import { checkIsAdminApp } from "@/utils/common";

import type { AccountSignupData, UserSignupData } from "../types/user";

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

describe("checkIsAdminApp", () => {
  it("returns true when the subdomain is admin", () => {
    const windowObject = {
      location: { hostname: "admin.example.com" },
    } as unknown as Window & typeof globalThis;

    vi.stubGlobal("window", windowObject);
    expect(checkIsAdminApp()).toBe(true);
    vi.unstubAllGlobals();
  });
});
