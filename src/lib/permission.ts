export type Permission = "Create" | "Read" | "Update" | "Delete";

type CRUDShorthand = `${"C" | ""}${"R" | ""}${"U" | ""}${"D" | ""}`

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

export class PermissionSet {
  private _permissions = new Set<Permission>;
  get permissions() {
    return this._permissions
  }

  constructor(initialPermissions: Permission[]);
  constructor(initialPermissions: CRUDShorthand);
  constructor(initialPermissions: Permission[] | CRUDShorthand) {
    let permissions: Permission[];
    if (Array.isArray(initialPermissions)) permissions = initialPermissions;
    else permissions = parseShorthand(initialPermissions);

    for (const permission of permissions) {
      this._permissions.add(permission)
    }
  }

  add(permission: Permission): void;
  add(permission: Permission[]): void;
  add(permission: Permission | Permission[]) {
    if (Array.isArray(permission)) {
      for (const p of permission) {
        this._permissions.add(p);
      }
    }

    else this._permissions.add(permission);
  }

  has(permission: Permission) {
    this._permissions.has(permission);
  }

  hasAny(permission: Permission[]): boolean {
    if (Array.isArray(permission)) {
      for (const p of permission) {
        if (!this._permissions.has(p)) return true
      }
    }
    return false;
  }

  hasAll(permission: Permission[]): boolean {
    if (Array.isArray(permission)) {
      for (const p of permission) {
        if (!this._permissions.has(p)) return false
      }
    }
    return true;
  }
}
