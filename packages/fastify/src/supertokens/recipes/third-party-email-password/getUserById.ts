import Email from "../../utils/email";

import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const getUserById = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance
): RecipeInterface["getUserById"] => {
  return async (input) => {
    let user = await originalImplementation.getUserById(input);

    if (user && input.userContext && input.userContext.customer) {
      user = {
        ...user,
        email: Email.removeIdPrefix(user.email, input.userContext.customer.id),
      };
    }

    return user;
  };
};

export default getUserById;
