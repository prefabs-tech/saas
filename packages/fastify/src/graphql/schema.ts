import { mergeTypeDefs } from "@graphql-tools/merge";

import accountSchema from "../model/accounts/schema";

export default mergeTypeDefs([accountSchema]);
