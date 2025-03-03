import Service from "../service";

import type { FastifyRequest, FastifyReply } from "fastify";

const getAccountTypes = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { config, query, slonik } = request as FastifyRequest<{
    Querystring: { locale: string | undefined };
  }>;

  const service = new Service(config, slonik);
  // FIXME: It is not clear what the default locale should be and how api consume the locale.
  const locale: string = query.locale || "en";

  const data = await service.getAccountTypes(locale);

  reply.send(data);
};

export default getAccountTypes;
