import Service from "./service";

import type { AccountCreateInput, AccountUpdateInput } from "../../types";
import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { MercuriusContext } from "mercurius";

const Mutation = {
  createAccount: async (
    parent: unknown,
    arguments_: {
      data: AccountCreateInput;
    },
    context: MercuriusContext,
  ) => {
    const service = new Service(context.config, context.database);

    try {
      if (!context.user) {
        throw new Error("UserId not found in session.");
      }

      const account = (await service.create(
        arguments_.data,
      )) as AccountCreateInput;

      return account;
    } catch (error) {
      console.log(error);
    }
  },

  deleteAccount: async (
    parent: unknown,
    arguments_: {
      id: number;
    },
    context: MercuriusContext,
  ) => {
    const service = new Service(context.config, context.database);

    try {
      const account = await service.delete(arguments_.id as number);

      return account;
    } catch (error) {
      console.log(error);
    }
  },

  updateAccount: async (
    parent: unknown,
    arguments_: {
      id: number;
      data: AccountUpdateInput;
    },
    context: MercuriusContext,
  ) => {
    const service = new Service(context.config, context.database);

    try {
      const account = await service.update(
        arguments_.id as number,
        arguments_.data as AccountUpdateInput,
      );

      return account;
    } catch (error) {
      console.log(error);
    }
  },
};

const Query = {
  account: async (
    parent: unknown,
    arguments_: { id: number },
    context: MercuriusContext,
  ) => {
    const service = new Service(context.config, context.database);

    return await service.findById(arguments_.id);
  },

  accounts: async (
    parent: unknown,
    arguments_: {
      limit: number;
      offset: number;
      filters?: FilterInput;
      sort?: SortInput[];
    },
    context: MercuriusContext,
  ) => {
    const service = new Service(context.config, context.database);

    return await service.list(
      arguments_.limit,
      arguments_.offset,
      arguments_.filters
        ? JSON.parse(JSON.stringify(arguments_.filters))
        : undefined,
      arguments_.sort ? JSON.parse(JSON.stringify(arguments_.sort)) : undefined,
    );
  },
};

export default { Mutation, Query };
