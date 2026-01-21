import type { Model } from "./lib/model";
import { getPermissions } from "./lib/permission";

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

const userResponse: Model<UserModelData, UserModelDataArgs> = {
  firstName: {
    value: "John",
    permissions: ["Read", "Update"],
  },
  lastName: {
    value: "Smith",
    permissions: ["Read", "Update"],
  },
  age: {
    value: 32,
    permissions: ["Read"],
  },
  address: {
    street: {
      value: "123 Main Street",
      permissions: ["Read", "Update"],
    },
    city: {
      value: "Smallville",
      permissions: ["Read"],
    },
    state: {
      value: "Utah",
      permissions: ["Read"],
    },
  },
};


