/* eslint-disable unicorn/no-null */
import getSaasConfig from "../config";
import CustomerService from "../model/customers/service";

import type { Customer } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const getCustomerByHostname = async (
  config: ApiConfig,
  database: Database,
  hostname: string,
): Promise<Customer | null> => {
  const service = new CustomerService(config, database);

  return (await service.findByHostname(hostname)) as unknown as Customer;
};

const getCustomerById = async (
  config: ApiConfig,
  database: Database,
  id: string | undefined,
): Promise<Customer | null> => {
  if (!id) {
    return null;
  }

  const service = new CustomerService(config, database);

  return (await service.findOne({
    AND: [
      { key: "id", operator: "eq", value: id },
      { key: "slug", operator: "eq", not: false, value: "NULL" },
    ],
  })) as unknown as Customer;
};

const discoverCustomer = async (
  config: ApiConfig,
  database: Database,
  hostname: string,
  id: string | undefined,
  isRouteExcludedFromDiscovery?: boolean,
): Promise<Customer | null> => {
  let customer;

  const saasConfig = getSaasConfig(config);

  const mainAppDomain = `${saasConfig.mainAppSubdomain}.${saasConfig.rootDomain}`;

  if (hostname === mainAppDomain) {
    if (isRouteExcludedFromDiscovery) {
      return null;
    }

    // discovery by http header
    customer = await getCustomerById(config, database, id);
  } else {
    // discovery by hostname
    customer = await getCustomerByHostname(config, database, hostname);
  }

  if (customer) {
    return customer;
  }

  throw new Error("Customer not found");
};

export default discoverCustomer;
