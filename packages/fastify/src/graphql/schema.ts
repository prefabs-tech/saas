import { mergeTypeDefs } from "@graphql-tools/merge";

import customerSchema from "../model/customers/schema";

export default mergeTypeDefs([customerSchema]);
