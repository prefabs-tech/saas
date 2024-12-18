import getAllReservedDomains from "./getAllReservedDomains";
import getAllReservedSlugs from "./getAllReservedSlugs";
import { CUSTOMER_HEADER_NAME } from "../constants";
import CustomerService from "../model/customers/service";

import type { Customer } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";
import type { IncomingHttpHeaders } from "node:http";

const discoverCustomerByHttpHeader = async (
  config: ApiConfig,
  database: Database,
  headers: IncomingHttpHeaders,
): Promise<Customer | null> => {
  const customerId = headers[CUSTOMER_HEADER_NAME] as string | undefined;

  if (!customerId) {
    throw new Error("Customer not found");
  }

  const service = new CustomerService(config, database);

  // findone by customerId and slug IS not NULL
  const customer = await service.findOneBy({
    AND: [
      { key: "id", operator: "eq", value: customerId },
      { key: "slug", operator: "eq", not: false, value: "NULL" },
    ],
  });

  if (customer) {
    return customer as unknown as Customer;
  }

  throw new Error("Customer not found");
};

const discoverCustomerByHostname = async (
  config: ApiConfig,
  database: Database,
  hostname: string,
): Promise<Customer | null> => {
  // if (getAllReservedDomains(config).includes(hostname)) {
  //   // eslint-disable-next-line unicorn/no-null
  //   return null;
  // }

  // if (
  //   getAllReservedSlugs(config).some(
  //     (slug: string) =>
  //       `${slug}.${config.saas?.subdomains?.rootDomain}` === hostname,
  //   )
  // ) {
  //   // eslint-disable-next-line unicorn/no-null
  //   return null;
  // }

  const service = new CustomerService(config, database);

  const customer = await service.findByHostname(hostname);

  if (customer) {
    return customer as unknown as Customer;
  }

  throw new Error("Customer not found");
};

export { discoverCustomerByHostname, discoverCustomerByHttpHeader };
