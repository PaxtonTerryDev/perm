import { Permission } from "./permission";
import { createRolemap, ModelRolemap, Rolemap, RolePermissions } from "./rolemap";
import { objectJoin, objectMap } from "./utils";
import { merge } from 'lodash';

export type Primitive = string | number | boolean | null | undefined;

export type ModelProperty<T> = {
  value: T | null;
  permissions: Rolemap;
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

// Might be cool to do some kind of Redis caching of these objects, so we don't have to rebuild them each time.
export abstract class Model<T extends {}, K extends unknown> {
  abstract url: ModelEndpoints;
  /**
   * The default roles for each field of the ViewModel
   */
  abstract get defaultRolePermissions(): ModelRolemap<T>;
  abstract fund(args?: K): Promise<ModelValues<T>> | ModelValues<T>
  abstract map(args?: K): Promise<ModelRolemap<T>> | ModelRolemap<T>

  async parse(json: string): Promise<T> {
    throw new Error("Not implemented");
  }

  async createViewModel(args?: K): Promise<ViewModel<T>> {
    // Need a wrapper function that builds out the view model automatically. something that joins the two together. maybe a lodash merge function
    const data = await this.fund(args)
    const permissions = await this.map(args)

    const merged = objectJoin(data, "value", permissions, "permissions")
    console.dir(merged);
    return merged;
  }

  async request(args?: K): Promise<ViewModel<T>> {
    // Should fetch the data from the url and return / parse it
    throw new Error("Not Implemented")
  }

  async patch(values: ModelPatchRequest<T>) {
    // Should provide a partial set of new values to attempt to update.
    // Any value can be attempted, but all permission handling is done on the server.
  }
}
