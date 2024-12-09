import updateFields from "../../utils/updateFields";

import type { FastifyInstance } from "fastify";
import type { APIInterface } from "supertokens-node/recipe/thirdpartyemailpassword/types";

const generatePasswordResetTokenPOST = (
  originalImplementation: APIInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): APIInterface["generatePasswordResetTokenPOST"] => {
  return async (input) => {
    input.userContext.customer = input.options.req.original.customer;

    if (originalImplementation.generatePasswordResetTokenPOST === undefined) {
      throw new Error("Should never come here");
    }

    input.formFields = updateFields(
      input.formFields,
      input.userContext.customer?.id
    );

    const originalResponse =
      await originalImplementation.generatePasswordResetTokenPOST(input);

    return originalResponse;
  };
};

export default generatePasswordResetTokenPOST;
