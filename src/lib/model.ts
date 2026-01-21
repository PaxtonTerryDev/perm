
export type Primitive = string | number | boolean | null | undefined;
export type Permission = "Create" | "Read" | "Update" | "Destroy";

export type RolePermissions = Record<string, Permission[]>

export type Field<T> = {
  value: T | null;
  permissions: RolePermissions;
};

export type ModelPermissions<T> = {
  [K in keyof T]: T[K] extends Primitive
  ? T[K]
  : T[K] extends Array<infer U>
  ? U extends RolePermissions
  ? T[K]
  : ModelPermissions<U>[]
  : ModelPermissions<T[K]>;
}

export type ViewModel<T> = {
  [K in keyof T]: T[K] extends Primitive
  ? Field<T[K]>
  : T[K] extends Array<infer U>
  ? U extends Primitive
  ? Field<T[K]>
  : ViewModel<U>[]
  : ViewModel<T[K]>;
};

export type ModelValues<T> = {
  [K in keyof T]: T[K] extends Primitive
  ? T[K]
  : T[K] extends Array<infer U>
  ? U extends Primitive
  ? T[K]
  : ModelValues<U>[]
  : ModelValues<T[K]>;
}

export interface ModelEndpoints<T> {
  get: (args: T) => string;
  patch: (args: T) => string;
}


// Might be cool to do some kind of Redis caching of these objects, so we don't have to rebuild them each time.
export abstract class Model<T extends {}, K extends unknown> {
  abstract url: ModelEndpoints<K>;

  abstract fetch: Promise<T> | T;
  abstract rolePermissions: ModelPermissions<T>;
}
