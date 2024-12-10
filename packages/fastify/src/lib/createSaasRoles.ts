import UserRoles from "supertokens-node/recipe/userroles";

import {
  ROLE_SAAS_ACCOUNT_ADMIN,
  ROLE_SAAS_ACCOUNT_MEMBER,
  ROLE_SAAS_ACCOUNT_OWNER,
} from "../constants";

const createSaasRoles = async () => {
  await UserRoles.createNewRoleOrAddPermissions(ROLE_SAAS_ACCOUNT_ADMIN, []);
  await UserRoles.createNewRoleOrAddPermissions(ROLE_SAAS_ACCOUNT_OWNER, []);
  await UserRoles.createNewRoleOrAddPermissions(ROLE_SAAS_ACCOUNT_MEMBER, []);
};

export default createSaasRoles;
