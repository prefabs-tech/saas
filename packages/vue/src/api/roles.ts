import { STATUS_ERROR } from "../constant";
import client, { encodeURIParameter } from "./axios";

import type { Role, RolePermissionsInput } from "../types";

export const createRole = async (
  data: Role,
  apiBaseUrl: string,
): Promise<Role> => {
  const response = await client(apiBaseUrl).post(
    "/roles",
    data,
    {
      withCredentials: true,
    },
  );

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const deleteRole = async (
  role: string,
  apiBaseUrl: string,
): Promise<Role> => {
  const response = await client(apiBaseUrl).delete(
    "/roles",
    {
      params: {
        role: encodeURIParameter(role),
      }
    },
  );

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};

export const getPermissions = async (
  apiBaseUrl: string,
) => {
  return await client(apiBaseUrl).get(`permissions`);
};

export const getRoles = async (
  apiBaseUrl: string,
) => {
  const response = await client(apiBaseUrl).get(`roles`);

  return {
    ...response.data,
    roles: response.data.roles.map((role: Role, id: number) => ({
      ...role,
      id,
    }))
  };
};

export const updateRolePermissions = async (
  data: RolePermissionsInput,
  apiBaseUrl: string,
): Promise<Role> => {
  const response = await client(apiBaseUrl).put(
    "/roles/permissions",
    data,
    {
      withCredentials: true,
    },
  );

  if (response.data.status === STATUS_ERROR) {
    throw new Error(response.data.message);
  } else {
    return response.data;
  }
};
