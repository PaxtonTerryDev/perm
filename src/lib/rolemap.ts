import { CRUDShorthand, Permission, PermissionSet } from "./permission"

export type Rolemap = Record<string, Permission[]>;

export type ModelRolemap<T> = {
  [K in keyof T]: Rolemap;
}
export function createRolemap(...args: RolePermissions[]): Rolemap;
export function createRolemap(...args: Rolemap[]): Rolemap;
export function createRolemap(...args: (RolePermissions | Rolemap)[]): Rolemap {
  let rolemap: Rolemap = {}

  for (let r of args) {
    if (r instanceof RolePermissions) r = r.toRolemapEntry();
    rolemap = {...rolemap, ...r};
  }
  return rolemap;
}

type RolemapDefinition = [string, Permission[] | CRUDShorthand];

export class RolePermissions {
  private _role: string;
  public get role(): string {
    return this._role;
  }

  private _permissions: PermissionSet;
  public get permissions(): PermissionSet {
    return this._permissions;
  }

  constructor(definition: RolemapDefinition) {
    this._role = definition[0];
    this._permissions = new PermissionSet(definition[1]);
  }

  toRolemapEntry() {
    const obj: Record<string, Permission[]> = {};

    obj[this.role] = this.permissions.toArray();

    return obj

  }
}
