export type Permission = "Create" | "Read" | "Update" | "Delete";
export type ModelValue = string | number | boolean; 
/**
 * Intended to be delivered from the server to the client. Outlines the data the client is allowed to see, along with that data's value, and the action sets that can be taken by the user.
 *
 * When a data group is delivered, and can be asserted that there will be a corresponding action group delivered with the payload as well.
 * @property data - The data that the client is allowed to render given the user's permissions.
 * @property actions - The actions that a client can take against a component.
 *
 * @example 
 * {
 *    data: {
 *      users: [
 *        {
 *          firstName: "John",
 *          lastName: "Smith",
 *          address: {
 *            street: "123 Main street",
 *            city: "Smallville",
 *            state: "Utah"
 *          } 
 *        }
 *      ]
 *    },
 *    actions: [
 *      users: {
 *        firstName: ["READ", "UPDATE"],
 *        lastName: ["READ", "UPDATE"],
 *      }
 * }
 */
export interface ModelProp {
  value: ModelValue;
  permissions: Permission[];
}

export type ViewModel<T> = Record<keyof T, ModelProp> 



export class Action {}
export class ActionSet {}
export class PermissionSet {}
