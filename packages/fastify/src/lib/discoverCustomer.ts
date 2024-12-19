import getAllReservedDomains from "./getAllReservedDomains";
import getAllReservedSlugs from "./getAllReservedSlugs";
import getSubdomainsConfig from "./getSubdomainsConfig";
import CustomerService from "../model/customers/service";

import type { Customer } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const discoverByHostname = async (
  config: ApiConfig,
  database: Database,
  hostname: string,
): Promise<Customer | null> => {
  const service = new CustomerService(config, database);

  return (await service.findByHostname(hostname)) as unknown as Customer;
};

const discoverByIdWithoutSlug = async (
  config: ApiConfig,
  database: Database,
  id: string | undefined,
): Promise<Customer | null> => {
  // const customerId = headers[CUSTOMER_HEADER_NAME] as string | undefined;

  if (!id) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  const service = new CustomerService(config, database);

  // findone by customerId and slug IS not NULL
  return (await service.findOneBy({
    AND: [
      { key: "id", operator: "eq", value: id },
      { key: "slug", operator: "eq", not: false, value: "NULL" },
    ],
  })) as unknown as Customer;
};

const isHostnameBlacklisted = (
  config: ApiConfig,
  hostname: string,
): boolean => {
  const subdomainsConfig = getSubdomainsConfig(config);

  if (!subdomainsConfig.reserved.blacklisted.enabled) {
    return false;
  }

  return (
    subdomainsConfig.reserved.blacklisted.slugs.some(
      (slug: string) => `${slug}.${subdomainsConfig.rootDomain}` === hostname,
    ) || subdomainsConfig.reserved.blacklisted.domains.includes(hostname)
  );
};

const isRouteIgnored = (
  ignoreRoutePatterns: Array<string | RegExp>,
  route: string,
) => {
  const regexPatterns = ignoreRoutePatterns.map((pattern) =>
    pattern instanceof RegExp ? pattern : new RegExp(`^${pattern}`),
  );

  return regexPatterns.some((regex) => regex.test(route));
};

const discoverCustomer = async (
  config: ApiConfig,
  database: Database,
  hostname: string,
  route: string,
  id: string | undefined,
): Promise<Customer | null> => {
  let customer;
  const subdomainsConfig = getSubdomainsConfig(config);

  if (isHostnameBlacklisted(config, hostname)) {
    throw new Error("Blacklisted hostname");
  }

  //FIXME skip domain discovery for all reserved slugs /domains except for main app
  if (getAllReservedDomains(config).includes(hostname)) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  if (
    getAllReservedSlugs(config).some(
      (slug: string) =>
        `${slug}.${config.saas?.subdomains?.rootDomain}` === hostname,
    )
  ) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  if (subdomainsConfig.enabled) {
    customer = await discoverByHostname(config, database, hostname);
  }

  if (!customer && !subdomainsConfig.required) {
    const ignoreRoutePatterns = config.saas?.ignoreRoutePatterns ?? [
      /^\/auth\//,
    ];

    if (isRouteIgnored(ignoreRoutePatterns, route)) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    // discovery by http header
    customer = await discoverByIdWithoutSlug(config, database, id);
  }

  if (customer) {
    return customer;
  }

  throw new Error("Customer not found");
};

export default discoverCustomer;
