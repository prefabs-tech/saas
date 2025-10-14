/* eslint-disable unicorn/no-null */
import getSaasConfig from "../config";
import AccountService from "../model/accounts/service";

import type { Account } from "../types";
import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { Database } from "@prefabs.tech/fastify-slonik";

const getAccountByHostname = async (
  config: ApiConfig,
  database: Database,
  hostname: string,
): Promise<Account | null> => {
  const service = new AccountService(config, database);

  return (await service.findByHostname(hostname)) as unknown as Account;
};

const getAccountById = async (
  config: ApiConfig,
  database: Database,
  id: string | undefined,
): Promise<Account | null> => {
  if (!id) {
    return null;
  }

  const service = new AccountService(config, database);

  return (await service.findOne({
    AND: [
      { key: "id", operator: "eq", value: id },
      { key: "slug", operator: "eq", not: false, value: "NULL" },
    ],
  })) as unknown as Account;
};

const discoverAccount = async (
  config: ApiConfig,
  database: Database,
  hostname: string,
  id: string | undefined,
  isRouteExcludedFromDiscovery?: boolean,
): Promise<Account | null> => {
  let account;

  const saasConfig = getSaasConfig(config);

  if (
    saasConfig.mainApp.skipHostnameCheck ||
    hostname === saasConfig.mainApp.domain
  ) {
    if (isRouteExcludedFromDiscovery) {
      return null;
    }

    // discovery by http header
    account = await getAccountById(config, database, id);
  } else {
    // discovery by hostname
    account = await getAccountByHostname(config, database, hostname);
  }

  if (account) {
    return account;
  }

  throw new Error("Account not found");
};

export default discoverAccount;
