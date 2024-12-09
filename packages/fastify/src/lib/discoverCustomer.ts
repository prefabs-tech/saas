import getAllReservedDomains from "./getAllReservedDomains";
import getAllReservedSlugs from "./getAllReservedSlugs";
import CustomerService from "../model/customers/service";

import type { Customer } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const discoverCustomer = async (
  config: ApiConfig,
  database: Database,
  host: string
): Promise<Customer | null> => {
  if (getAllReservedDomains(config).includes(host)) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  if (
    getAllReservedSlugs(config).some(
      (slug: string) =>
        `${slug}.${config.saas?.subdomains?.rootDomain}` === host
    )
  ) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  const service = new CustomerService(config, database);

  const customer = await service.findByHostname(host);

  if (customer) {
    return customer as unknown as Customer;
  }

  throw new Error("Customer not found");
};

export default discoverCustomer;
