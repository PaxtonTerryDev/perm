import { Permission } from "./permission";

export type Primitive = string | number | boolean | null | undefined;

export type ModelProperty<T> = {
  value: T | null;
  permissions: Permission[];
};

export type Model<T> = {
  [K in keyof T]: T[K] extends Primitive
    ? ModelProperty<T[K]>
    : T[K] extends Array<infer U>
      ? Model<U>[]
      : Model<T[K]>;
};
