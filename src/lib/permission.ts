export type Permission = "Create" | "Read" | "Update" | "Delete";

export function getPermissions<T extends { permissions: Permission[] }>(prop: T): Permission[] {
  return prop.permissions;
} 

export class Action {}
export class ActionSet {}
export class PermissionSet {}
