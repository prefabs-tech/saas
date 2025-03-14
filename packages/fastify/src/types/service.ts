import type { Service as BaseService } from "@dzangolab/fastify-slonik";

interface Service<T, C, U> extends BaseService<T, C, U> {
  accountId: string | undefined;
}

export type { Service };
