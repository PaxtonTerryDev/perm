import { Model, ModelEndpoints, ModelPermissions } from "./lib/model";

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

class UserModelData extends Model<UserModelData, UserModelDataArgs> {
  url: ModelEndpoints<UserModelDataArgs> = {
    get: ({ userId }) => `/api/user/${userId}`,
    patch: ({ userId }) => `/api/user/${userId}`
  };
  fetch: UserModelData | Promise<UserModelData>;
  rolePermissions: ModelPermissions<UserModelData>;
}
