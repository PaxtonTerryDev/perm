import { createRolePermissions, Model, ModelEndpoints, ModelPermissions, ModelValues, RolePermissionDefinition } from "./lib/api/model";
import { logObject } from "./lib/utils/log-object";

interface Address {
  street: string;
  city: string;
  state: string;
}

interface UserModelDataArgs {
  userId: string;
}

interface UserModelData {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  address: Address;
  documents: Document[];
}

interface Document {
  name: string;
  url: string;
  valid: boolean;
}


const userRoles: RolePermissionDefinition = ["User", "R"];
const adminRoles: RolePermissionDefinition = ["Admin", "CRUD"]

class UserModel extends Model<UserModelData, UserModelDataArgs> {

  url: ModelEndpoints<UserModelDataArgs> = {
    get: ({ userId }) => `/api/user/${userId}`,
    patch: ({ userId }) => `/api/user/${userId}`
  };
  fetch(): UserModelData | Promise<UserModelData> {
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

  updatePermissions(values: ModelValues<UserModelData>, args?: UserModelDataArgs | undefined): ModelPermissions<UserModelData> | Promise<ModelPermissions<UserModelData>> {
    return this.defaultPermissions;
  }

  defaultPermissions: ModelPermissions<UserModelData> = {
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

(async () => {
  const user = new UserModel();
  await user.init({ userId: "123" });
  logObject(user.modelView ?? {}, "ModelView");
  logObject(user.sanitize('User'), "ModelView (Sanitized)")
})();


