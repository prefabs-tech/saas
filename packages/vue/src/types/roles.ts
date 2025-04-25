export interface Role {
  role: string;
  permissions: string[];
}

export interface RolePermissionsInput {
  role: string;
  permissions?: string[];
}
