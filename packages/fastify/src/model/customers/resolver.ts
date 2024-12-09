import Service from "./service";

import type { CustomerCreateInput, CustomerUpdateInput } from "../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  createCustomer: async (
    parent: unknown,
    arguments_: {
      data: CustomerCreateInput;
    },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    try {
      if (!context.user) {
        throw new Error("UserId not found in session.");
      }

      const customer = (await service.create(
        arguments_.data
      )) as CustomerCreateInput;

      return customer;
    } catch (error) {
      console.log(error);
    }
  },

  deleteCustomer: async (
    parent: unknown,
    arguments_: {
      id: number;
    },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    try {
      const Customer = await service.delete(arguments_.id as number);

      return Customer;
    } catch (error) {
      console.log(error);
    }
  },

  updateCustomer: async (
    parent: unknown,
    arguments_: {
      id: number;
      data: CustomerUpdateInput;
    },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    try {
      const Customer = await service.update(
        arguments_.id as number,
        arguments_.data as CustomerUpdateInput
      );

      return Customer;
    } catch (error) {
      console.log(error);
    }
  },
};

const Query = {
  customer: async (
    parent: unknown,
    arguments_: { id: number },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    return await service.findById(arguments_.id);
  },

  customers: async (
    parent: unknown,
    arguments_: {
      limit: number;
      offset: number;
      filters?: FilterInput;
      sort?: SortInput[];
    },
    context: MercuriusContext
  ) => {
    const service = new Service(context.config, context.database);

    return await service.list(
      arguments_.limit,
      arguments_.offset,
      arguments_.filters
        ? JSON.parse(JSON.stringify(arguments_.filters))
        : undefined,
      arguments_.sort ? JSON.parse(JSON.stringify(arguments_.sort)) : undefined
    );
  },
};

export default { Mutation, Query };
