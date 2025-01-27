import Email from "../../utils/email";

import type { FastifyInstance } from "fastify";
import type { RecipeInterface } from "supertokens-node/recipe/thirdpartyemailpassword";

const getUserById = (
  originalImplementation: RecipeInterface,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify: FastifyInstance,
): RecipeInterface["getUserById"] => {
  return async (input) => {
    let user = await originalImplementation.getUserById(input);

    if (user) {
      user = {
        ...user,
        email: Email.removePrefix(
          user.email,
          input.userContext?.authEmailPrefix,
        ),
      };
    }

    return user;
  };
};

export default getUserById;
