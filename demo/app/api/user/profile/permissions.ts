import { createRolePermissions, Model, ModelEndpoints, ModelPermissions, ModelValues, RolePermissionDefinition } from "@/lib/api/model";
import { UserProfile, UserModelDataArgs } from "@/types/user-profile";

const userRoles: RolePermissionDefinition = ["User", "R"];
const adminRoles: RolePermissionDefinition = ["Admin", "CRUD"]

export class UserModel extends Model<UserProfile, UserModelDataArgs> {
  url: ModelEndpoints<UserModelDataArgs> = {
    get: ({ userId }) => `/api/user/${userId}`,
    patch: ({ userId }) => `/api/user/${userId}`
  };
  fetch(): UserProfile | Promise<UserProfile> {
    return {
      id: "123",
      firstName: "Bingus",
      lastName: "Bonk",
      age: 21,
      address: {
        street: "123 Bingus Street",
        city: "Lingus",
        state: "Ohio"
      },
      documents: [
        {
          name: "Document 1",
          url: "/url/document_1",
          valid: true
        },
        {
          name: "Document 2",
          url: "/url/document_2",
          valid: true
        },
        {
          name: "Document 3",
          url: "/url/document_3",
          valid: true
        },
      ]
    }
  }

  updatePermissions(values: ModelValues<UserProfile>, args?: UserModelDataArgs | undefined): ModelPermissions<UserProfile> | Promise<ModelPermissions<UserProfile>> {
    return this.defaultPermissions;
  }

  defaultPermissions: ModelPermissions<UserProfile> = {
    id: createRolePermissions(adminRoles, userRoles),
    firstName: createRolePermissions(adminRoles, userRoles),
    lastName: createRolePermissions(adminRoles, userRoles),
    age: createRolePermissions(adminRoles, userRoles),
    address: {
      street: createRolePermissions(adminRoles, userRoles),
      city: createRolePermissions(adminRoles, userRoles),
      state: createRolePermissions(adminRoles, userRoles),
    },
    documents: createRolePermissions(adminRoles, ['User', ""]),
  }
}
