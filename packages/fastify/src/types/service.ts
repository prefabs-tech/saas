import type { Service as BaseService } from "@dzangolab/fastify-slonik";

interface AccountAwareService<T, C, U> extends BaseService<T, C, U> {
  accountId: string | undefined;
}

export type { AccountAwareService };
