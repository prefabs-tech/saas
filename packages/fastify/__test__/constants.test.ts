import { describe, expect, it } from "vitest";

import {
  ACCOUNT_HEADER_NAME,
  ACCOUNT_INVITATION_ACCEPT_LINK_PATH,
  NANOID_ALPHABET,
  NANOID_SIZE,
  ROLE_SAAS_ACCOUNT_ADMIN,
  ROLE_SAAS_ACCOUNT_MEMBER,
  ROLE_SAAS_ACCOUNT_OWNER,
} from "../src/constants";

describe("constants", () => {
  it("ACCOUNT_HEADER_NAME is x-account-id", () => {
    expect(ACCOUNT_HEADER_NAME).toBe("x-account-id");
  });

  it("ACCOUNT_INVITATION_ACCEPT_LINK_PATH matches expected template", () => {
    expect(ACCOUNT_INVITATION_ACCEPT_LINK_PATH).toBe(
      "/invitation/token/:token?accountId=:accountId",
    );
  });

  it("NANOID_ALPHABET contains only lowercase letters and digits", () => {
    expect(NANOID_ALPHABET).toBe("abcdefghijklmnopqrstuvwxyz0123456789");
    expect(NANOID_ALPHABET).toMatch(/^[a-z0-9]+$/);
  });

  it("NANOID_SIZE is 8", () => {
    expect(NANOID_SIZE).toBe(8);
  });

  it("ROLE_SAAS_ACCOUNT_ADMIN is SAAS_ACCOUNT_ADMIN", () => {
    expect(ROLE_SAAS_ACCOUNT_ADMIN).toBe("SAAS_ACCOUNT_ADMIN");
  });

  it("ROLE_SAAS_ACCOUNT_OWNER is SAAS_ACCOUNT_OWNER", () => {
    expect(ROLE_SAAS_ACCOUNT_OWNER).toBe("SAAS_ACCOUNT_OWNER");
  });

  it("ROLE_SAAS_ACCOUNT_MEMBER is SAAS_ACCOUNT_MEMBER", () => {
    expect(ROLE_SAAS_ACCOUNT_MEMBER).toBe("SAAS_ACCOUNT_MEMBER");
  });
});
