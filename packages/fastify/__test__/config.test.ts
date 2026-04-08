import { describe, expect, it } from "vitest";

import getSaasConfig from "../src/config";

import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { SaasConfig } from "../src/types";

declare module "@prefabs.tech/fastify-config" {
  interface ApiConfig {
    saas?: SaasConfig;
  }
}

const base = { saas: { rootDomain: "example.test" } } as ApiConfig;

describe("getSaasConfig", () => {
  describe("apps", () => {
    it("defaults to a single admin app with computed domain", () => {
      const config = getSaasConfig(base);
      expect(config.apps).toEqual([
        { name: "admin", subdomain: "admin", domain: "admin.example.test" },
      ]);
    });

    it("computes app domain from subdomain when not provided", () => {
      const config = getSaasConfig({
        saas: {
          rootDomain: "example.test",
          apps: [{ name: "dash", subdomain: "dash" }],
        },
      } as ApiConfig);
      expect(config.apps[0].domain).toBe("dash.example.test");
    });

    it("preserves explicit app domain over subdomain computation", () => {
      const config = getSaasConfig({
        saas: {
          rootDomain: "example.test",
          apps: [{ name: "dash", subdomain: "dash", domain: "custom.io" }],
        },
      } as ApiConfig);
      expect(config.apps[0].domain).toBe("custom.io");
    });
  });

  describe("excludeRoutePatterns", () => {
    it("includes four built-in default patterns", () => {
      const config = getSaasConfig(base);
      expect(config.excludeRoutePatterns).toHaveLength(4);
      expect(config.excludeRoutePatterns[0]).toEqual(/^\/$/)
      expect(config.excludeRoutePatterns[1]).toEqual(/^\/auth\//);
      expect(config.excludeRoutePatterns[2]).toBe("/me");
      expect(config.excludeRoutePatterns[3]).toBe("/invitation/token/");
    });

    it("appends custom patterns after the built-in defaults", () => {
      const config = getSaasConfig({
        saas: {
          rootDomain: "example.test",
          excludeRoutePatterns: ["/custom"],
        },
      } as ApiConfig);
      expect(config.excludeRoutePatterns).toHaveLength(5);
      expect(config.excludeRoutePatterns[4]).toBe("/custom");
    });
  });

  describe("mainApp", () => {
    it("defaults mainApp subdomain to 'app'", () => {
      const config = getSaasConfig(base);
      expect(config.mainApp.subdomain).toBe("app");
    });

    it("defaults mainApp domain to app.<rootDomain>", () => {
      const config = getSaasConfig(base);
      expect(config.mainApp.domain).toBe("app.example.test");
    });

    it("sets skipHostnameCheck to true when subdomains is 'disabled'", () => {
      const config = getSaasConfig({
        saas: { rootDomain: "example.test", subdomains: "disabled" },
      } as ApiConfig);
      expect(config.mainApp.skipHostnameCheck).toBe(true);
    });

    it("sets skipHostnameCheck to false when subdomains is 'required'", () => {
      const config = getSaasConfig({
        saas: { rootDomain: "example.test", subdomains: "required" },
      } as ApiConfig);
      expect(config.mainApp.skipHostnameCheck).toBe(false);
    });

    it("sets skipHostnameCheck to false when subdomains is 'optional'", () => {
      const config = getSaasConfig({
        saas: { rootDomain: "example.test", subdomains: "optional" },
      } as ApiConfig);
      expect(config.mainApp.skipHostnameCheck).toBe(false);
    });
  });

  describe("multiDatabase", () => {
    it("defaults mode to 'disabled'", () => {
      const config = getSaasConfig(base);
      expect(config.multiDatabase.mode).toBe("disabled");
    });

    it("defaults migrations.path to migrations/accounts", () => {
      const config = getSaasConfig(base);
      expect(config.multiDatabase.migrations.path).toBe("migrations/accounts");
    });

    it("uses slonik.migrations.path as base for multiDatabase.migrations.path", () => {
      const config = getSaasConfig({
        saas: { rootDomain: "example.test" },
        slonik: { migrations: { path: "db/migrations" } },
      } as ApiConfig);
      expect(config.multiDatabase.migrations.path).toBe(
        "db/migrations/accounts",
      );
    });
  });

  describe("invalid", () => {
    it("defaults invalid.domains to []", () => {
      const config = getSaasConfig(base);
      expect(config.invalid.domains).toEqual([]);
    });

    it("defaults invalid.slugs to ['admin']", () => {
      const config = getSaasConfig(base);
      expect(config.invalid.slugs).toEqual(["admin"]);
    });

    it("uses custom invalid.slugs when provided", () => {
      const config = getSaasConfig({
        saas: {
          rootDomain: "example.test",
          invalid: { slugs: ["admin", "root", "superuser"] },
        },
      } as ApiConfig);
      expect(config.invalid.slugs).toEqual(["admin", "root", "superuser"]);
    });

    it("uses custom invalid.domains when provided", () => {
      const config = getSaasConfig({
        saas: {
          rootDomain: "example.test",
          invalid: { domains: ["blocked.com"] },
        },
      } as ApiConfig);
      expect(config.invalid.domains).toEqual(["blocked.com"]);
    });
  });

  describe("tables", () => {
    it("defaults all table names", () => {
      const config = getSaasConfig(base);
      expect(config.tables.accounts.name).toBe("__accounts");
      expect(config.tables.accountTypes.name).toBe("__account_types");
      expect(config.tables.accountTypesI18n.name).toBe("__account_types_i18n");
      expect(config.tables.accountUsers.name).toBe("__account_users");
      expect(config.tables.accountAddresses.name).toBe("__account_addresses");
      expect(config.tables.accountInvitations.name).toBe(
        "__account_invitations",
      );
    });
  });
});
