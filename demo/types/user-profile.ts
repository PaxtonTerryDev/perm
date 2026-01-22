export interface Address {
  street: string;
  city: string;
  state: string;
}

export interface UserProfileArgs {
  userRole: "Admin" | "User";
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  address: Address;
  documents: Document[];
}

export interface Document {
  name: string;
  url: string;
  valid: boolean;
}

