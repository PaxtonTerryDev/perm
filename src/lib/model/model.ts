import { Permission, Permissions, RolePermissions } from "../permissions/permissions";

/**
 * For each (recursively) key of T, provides a `DataField` object.
 *
 * This is only used on the server, and must be sanitized based on the client's permissions before being delivered.
 */
export type DataModel<T> = {
  [K in keyof T]: T[K] extends any[]
    ? DataField
    : T[K] extends object
      ? DataModel<T>
      : DataField
};

/**
 * A structure containing a value, which can be any datatype OR an array of the same datatype. It also contains an array of RolePermission objects, which maps roles to initial access permissions for that particular field.
 */
export type DataField= {
  value: any | any[];
  permissions: RolePermissions;
};

/**
 * The sanitized view of the DataModel. 
 */
export type View<T> = {
  [K in keyof T]: T[K] extends any[]
    ? ViewField<T[K]>
    : T[K] extends object
      ? View<T>
      : ViewField<T[K]>;
};

/**
 * The view delivered to the client.  This is a sanitized version of `DataField`
 */
export type ViewField<T> = {
  value: T | null;
  permissions: Permission[];
}

/**
 * A structure containing the respective values for T
 */
export type Values<T> = {
  [K in keyof T]: T[K] extends any[]
    ? T[K]
    : T[K] extends object
      ? Values<T[K]>
      : T[K];
}

export class Model<T> {
  permissions: Permissions<T> | undefined; 

  // Need to define all the parameters for the model
  //
  // Base model instance will output the ClientModel instance that will fund the client component.
  // Create method to create server model
  // Create method to create client model

  createServerModel(): ServerModel<T> {
    // TODO: Need to populate this args data with internal config
    const args: ServerModelArgs<T> = {}
    return new ServerModel<T>(args);
  }

  createClientModel(): ClientModel<T> {
    const args: ClientModelArgs<T> = {}
    return new ClientModel<T>(args);
  }
}

interface ServerModelArgs<T> {}
export class ServerModel<T> {
  values: Values<T> | undefined;
  permissions: Values<T> | undefined;
  constructor(args: ServerModelArgs<T>) {}

  // Should process incoming requests made from the Client model.
  // Should fetch the data
  // map permissions onto data
  // potentially update permissions with function that processes state
  // respond to get and patch requests (provide methods that can be invoked by the route handlers in the api)
  // Response should always be a completely updated view model.

}

interface ClientModelArgs<T>{}
export class ClientModel<T> {
  constructor(args: ClientModelArgs<T>) {
  }
  // Should be able to request data from the api
  // Potentially validate it
  // Should be able to handle patch requests to the api
}

// TODO: Also should define a react hook that can store the data and 
