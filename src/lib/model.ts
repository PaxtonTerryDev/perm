import { Permission } from "./permission";

export type Primitive = string | number | boolean | null | undefined;

export type ModelProperty<T> = {
  value: T | null;
  permissions: Permission[];
};

export type ViewModel<T> = {
  [K in keyof T]: T[K] extends Primitive
    ? ModelProperty<T[K]>
    : T[K] extends Array<infer U>
      ? U extends Primitive
        ? ModelProperty<T[K]>
        : ViewModel<U>[]
      : ViewModel<T[K]>;
};

export type ModelPermissions<T> = {
  [K in keyof T]: Permission[];
}

export type ModelValues<T> = {
  [K in keyof T]: T[K] extends Primitive
    ? T[K]
    : T[K] extends Array<infer U>
      ? U extends Primitive
        ? T[K]
        : ModelValues<U>[]
      : ModelValues<T[K]>;
}

export type ModelPatchRequest<T> = Partial<ModelValues<T>>

export interface ModelEndpoints {
  get: string;
  patch: string;
}

type CRUDShorthand = `${"C" | ""}${"R" | ""}${"U" | ""}${"D" | ""}`

interface RolePermissionAssignment {
  role: string;
  permissions: Permission[]
}

type ModelRolemap<T> = {
  [K in keyof T]: Map<string, Permission[]>;
}
// Might be cool to do some kind of Redis caching of these objects, so we don't have to rebuild them each time.
export abstract class Model<T, K extends unknown> {
  protected data: T | undefined;

  abstract url: ModelEndpoints;
  abstract get rolemap(): ModelRolemap<T>; 
  abstract fund(args: K): ModelValues<T>
  abstract map(args: K): ModelPermissions<T>

  async parse(json: string): Promise<T> {
    throw new Error("Not implemented");
  }

  async request(args?: K): Promise<ViewModel<T>> {
    // Should fetch the data from the url and return / parse it
    throw new Error("Not Implemented")
  }

  async patch(values: ModelPatchRequest<T>) {
    // Should provide a partial set of new values to attempt to update.
    // Any value can be attempted, but all permission handling is done on the server.
  }

  protected generateRolemap(map: Partial<ModelRolemap<T>>, defaultPermissions = {}) {
 
  }

  protected roleMap(mapStruct: [string, CRUDShorthand]): RolePermissionAssignment {
    return {
      role: mapStruct[0],
      permissions: this.parseShorthand(mapStruct[1])
    }
  }

  private parseShorthand(sh: CRUDShorthand): Permission[] {
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
}
