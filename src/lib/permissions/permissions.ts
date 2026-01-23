export type Permission = "Create" | "Read" | "Update" | "Delete";
export type CRUDShorthand = `${"C" | ""}${"R" | ""}${"U" | ""}${"D" | ""}`

function parseShorthand(sh: CRUDShorthand): Permission[] {
  const p: Permission[] = [];
  const map = {
    "C": "Create",
    "R": "Read",
    "U": "Update",
    "D": "Delete"
  } as const;

  for (const char of sh) {
    p.push(map[char as keyof typeof map]);
  }
  return p;
}

export type RolePermissions = Record<string, Permission[]>

export type RolePermissionDefinition = [string, Permission[] | CRUDShorthand];

export function createRolePermissions(...args: RolePermissionDefinition[]): RolePermissions {
  let rolePermissions: RolePermissions = {};
  for (const d of args) {
    const role = d[0];
    let permissions: Permission[];

    if (typeof d[1] == "string") {
      permissions = parseShorthand(d[1])
    }
    else permissions = d[1];

    const newPermission: RolePermissions = {};
    newPermission[role] = permissions;

    rolePermissions = { ...rolePermissions, ...newPermission }
  }
  return rolePermissions;
}

export type Permissions<T> = {
  [K in keyof T]: T[K] extends any[]
    ? RolePermissions
    : T[K] extends object
      ? Permissions<T[K]>
      : RolePermissions;
}
