import UserRoles from "supertokens-node/recipe/userroles";

import { ROLE_SAAS_MEMBER, ROLE_SAAS_OWNER } from "../constants";

const createSaasRoles = async () => {
  await UserRoles.createNewRoleOrAddPermissions(ROLE_SAAS_OWNER, []);
  await UserRoles.createNewRoleOrAddPermissions(ROLE_SAAS_MEMBER, []);
};

export default createSaasRoles;
