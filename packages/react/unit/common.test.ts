import axios from "axios";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

import { client } from "@/api/axios/client";
import { ACCOUNT_HEADER_NAME } from "@/constants";
import { checkIsAdminApp } from "@/utils/common";

describe("checkIsAdminApp", () => {
  it("returns true when the subdomain is admin", () => {
    const dom = new JSDOM("", { url: "https://admin.example.com/" });
    const windowObject = dom.window as unknown as Window & typeof globalThis;
    const documentObject = dom.window.document as unknown as Document;

    vi.stubGlobal("window", windowObject);
    vi.stubGlobal("document", documentObject);
    expect(checkIsAdminApp()).toBe(true);
    vi.unstubAllGlobals();
  });

  it("returns false when the subdomain is not admin", () => {
    const dom = new JSDOM("", { url: "https://app.example.com/" });
    const windowObject = dom.window as unknown as Window & typeof globalThis;
    const documentObject = dom.window.document as unknown as Document;

    vi.stubGlobal("window", windowObject);
    vi.stubGlobal("document", documentObject);
    expect(checkIsAdminApp()).toBe(false);
    vi.unstubAllGlobals();
  });
});

describe("client (axios factory)", () => {
  it("creates axios instance with baseURL and default post JSON content-type", () => {
    const createSpy = vi.spyOn(axios, "create").mockReturnValue({} as never);

    client("https://api.example.com");

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://api.example.com",
        headers: expect.objectContaining({
          post: { "Content-Type": "application/json" },
        }),
      }),
    );
  });

  it("prefers localStorage account id when sessionStorage has any value (current behavior)", () => {
    const createSpy = vi.spyOn(axios, "create").mockReturnValue({} as never);

    sessionStorage.setItem(ACCOUNT_HEADER_NAME, "session-1");
    localStorage.setItem(ACCOUNT_HEADER_NAME, "local-1");

    client("https://api.example.com");

    const argument = createSpy.mock.calls[0]?.[0] as unknown as {
      headers?: Record<string, unknown>;
    };
    expect(argument.headers?.[ACCOUNT_HEADER_NAME]).toBe("local-1");
  });

  it("does not read localStorage when sessionStorage is empty (current behavior)", () => {
    const createSpy = vi.spyOn(axios, "create").mockReturnValue({} as never);

    sessionStorage.removeItem(ACCOUNT_HEADER_NAME);
    localStorage.setItem(ACCOUNT_HEADER_NAME, "local-1");

    client("https://api.example.com");

    const argument = createSpy.mock.calls[0]?.[0] as unknown as {
      headers?: Record<string, unknown>;
    };
    expect(argument.headers?.[ACCOUNT_HEADER_NAME]).toBeUndefined();
  });
});
