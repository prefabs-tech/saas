import type { Service as BaseService } from "@dzangolab/fastify-slonik";

interface AccountEnabledService<T, C, U> extends BaseService<T, C, U> {
  accountId: string | undefined;
}

export type { AccountEnabledService };
