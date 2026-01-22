import { objectJoin, objectMap } from "./utils/object-operations";

/**
 * The value of a field can either be a singlur type, or an array.
 *
 * If an array is used, permissions applied to the field will be transferred to each item in the array
 */
export type FieldValue = any | any[];
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

export type ExecutorField<T> = {
  value: T | null;
  permissions: RolePermissions;
};

export type Field<T> = {
  value: T | null;
  permissions: Permission[];
}

export type ModelPermissions<T> = {
  [K in keyof T]: T[K] extends any[]
    ? RolePermissions
    : T[K] extends object
      ? ModelPermissions<T[K]>
      : RolePermissions;
}

export type ModelExecutorView<T> = {
  [K in keyof T]: T[K] extends any[]
    ? ExecutorField<T[K]>
    : T[K] extends object
      ? ModelExecutorView<T[K]>
      : ExecutorField<T[K]>;
};

export type ModelView<T> = {
  [K in keyof T]: T[K] extends any[]
    ? Field<T[K]>
    : T[K] extends object
      ? ModelExecutorView<T[K]>
      : Field<T[K]>;
};

export type ModelValues<T> = {
  [K in keyof T]: T[K] extends any[]
    ? T[K]
    : T[K] extends object
      ? ModelValues<T[K]>
      : T[K];
}

export interface ModelEndpoints<T> {
  get: (args: T) => string;
  patch: (args: T) => string;
}


// Might be cool to do some kind of Redis caching of these objects, so we don't have to rebuild them each time.
export abstract class Model<T extends {}, K extends unknown> {
  modelValues: ModelValues<T> | undefined;
  modelPermissions: ModelPermissions<T> | undefined;
  modelView: ModelExecutorView<T> | undefined;

  abstract url: ModelEndpoints<K>;

  abstract defaultPermissions: ModelPermissions<T>;
  abstract fetch(args?: K): Promise<T> | T;
  abstract updatePermissions(values: ModelValues<T>, args?: K): Promise<ModelPermissions<T>> | ModelPermissions<T>;

  async init(args?: K) {
    this.modelValues = await this.createModelValues(args);
    this.modelPermissions = await this.updatePermissions(this.modelValues, args);
    this.modelView = this.createModelView();
  };

  private async createModelValues(args?: K): Promise<ModelValues<T>> {
    const data = await this.fetch(args);
    return data as ModelValues<T>;
  }

  private createModelView(): ModelExecutorView<T> {
    if (!this.modelValues) {
      throw new Error("modelValues is undefined - ensure the init method has been run")
    }    
    if (!this.modelPermissions) {
      throw new Error("modelPermissions is undefined - ensure the init method has been run")
    }
    return objectJoin(this.modelValues, "value", this.modelPermissions, "permissions") as ModelExecutorView<T>
  }

  sanitize(role: string): ModelView<T> {
    if (!this.modelView) {
      throw new Error("modelView undefined.  Model must be initialized before performing sanitation")
    }
    return objectMap(this.modelView as Record<string, unknown>, (_, field) => {
      const f = field as ExecutorField<unknown>;
      const permissions = f.permissions[role] || [];
      const value = permissions.includes("Read") ? f.value : null;
      return { value, permissions };
    }) as ModelView<T>;
  }
}
