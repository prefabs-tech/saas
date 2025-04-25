import { defineStore } from "pinia";

import {
  createRole as doCreateRole,
  deleteRole as doDeleteRole,
  getPermissions as doGetPermissions,
  getRoles as doGetRoles,
  updateRolePermissions as doUpdateRolePermissions,
} from "../api/roles";

import type { Role, RolePermissionsInput } from "../types";

const useRolesStore = defineStore("roles", () => {
  const createRole = async (data: Role, apiBaseUrl: string) => {
    return await doCreateRole(data, apiBaseUrl);
  };

  const deleteRole = async (role: string, apiBaseUrl: string) => {
    return await doDeleteRole(role, apiBaseUrl);
  };

  const getPermissions = async (apiBaseUrl: string) => {
    return await doGetPermissions(apiBaseUrl);
  };

  const getRoles = async (apiBaseUrl: string) => {
    return await doGetRoles(apiBaseUrl);
  };

  const updateRolePermissions = async (data: RolePermissionsInput, apiBaseUrl: string) => {
    return await doUpdateRolePermissions(data, apiBaseUrl);
  };

  return {
    createRole,
    deleteRole,
    getPermissions,
    getRoles,
    updateRolePermissions,
  };
});

export default useRolesStore;
