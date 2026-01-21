import { Model, ModelEndpoints, ModelPermissions, ModelValues } from "./lib/model";
import { createRolemap, ModelRolemap, RolePermissions } from "./lib/rolemap";
import { objectMap } from "./lib/utils";

interface Address {
  street: string;
  city: string;
  state: string;
}

interface UserModelDataArgs {
  userId: string;
}

interface UserModelData {
  firstName: string;
  lastName: string;
  age: number;
  address: Address;
}

class UserModel extends Model<UserModelData, UserModelDataArgs> {
  url: ModelEndpoints = {
    get: "/api/user",
    patch: "/api/user"
  }

  adminRoles = new RolePermissions(["Admin", "CRUD"]);
  userRoles = new RolePermissions(["User", "R"]);
  defaultRolemap = createRolemap(this.adminRoles, this.userRoles);
  
  fund(_args: UserModelDataArgs): ModelValues<UserModelData> {
    return {
      firstName: "Bingus",
      lastName: "Lingus",
      age: 21,
      address: {
        street: "Bingus Street",
        city: "Bingus City",
        state: "Bingus State"
      }
    }
  }

  map(_args: UserModelDataArgs): ModelRolemap<UserModelData> {

  }
}

const userModel = new UserModel();
Promise.resolve(userModel.createViewModel({ userId: "1" }))
