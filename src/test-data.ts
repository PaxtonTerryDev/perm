import type { Permission } from "./lib/model.ts";

export type Role = "Admin" | "Editor" | "Viewer";

export type Resource = "User" | "Post" | "Comment";

export type Field<T extends Resource> =
  T extends "User" ? "firstName" | "lastName" | "email" | "role"
  : T extends "Post" ? "title" | "body" | "author" | "publishedAt"
  : T extends "Comment" ? "text" | "author" | "createdAt"
  : never;

export interface RolePermission<T extends Resource = Resource> {
  resource: T;
  field: Field<T>;
  permissions: Permission[];
}

export const ROLE_PERMISSIONS: Record<Role, RolePermission[]> = {
  Admin: [
    { resource: "User", field: "firstName", permissions: ["Create", "Read", "Update", "Delete"] },
    { resource: "User", field: "lastName", permissions: ["Create", "Read", "Update", "Delete"] },
    { resource: "User", field: "email", permissions: ["Create", "Read", "Update", "Delete"] },
    { resource: "User", field: "role", permissions: ["Create", "Read", "Update", "Delete"] },
    { resource: "Post", field: "title", permissions: ["Create", "Read", "Update", "Delete"] },
    { resource: "Post", field: "body", permissions: ["Create", "Read", "Update", "Delete"] },
    { resource: "Post", field: "author", permissions: ["Create", "Read", "Update", "Delete"] },
    { resource: "Post", field: "publishedAt", permissions: ["Create", "Read", "Update", "Delete"] },
  ],
  Editor: [
    { resource: "User", field: "firstName", permissions: ["Read"] },
    { resource: "User", field: "lastName", permissions: ["Read"] },
    { resource: "User", field: "email", permissions: ["Read"] },
    { resource: "User", field: "role", permissions: [] },
    { resource: "Post", field: "title", permissions: ["Create", "Read", "Update"] },
    { resource: "Post", field: "body", permissions: ["Create", "Read", "Update"] },
    { resource: "Post", field: "author", permissions: ["Read"] },
    { resource: "Post", field: "publishedAt", permissions: ["Read", "Update"] },
  ],
  Viewer: [
    { resource: "User", field: "firstName", permissions: ["Read"] },
    { resource: "User", field: "lastName", permissions: ["Read"] },
    { resource: "User", field: "email", permissions: [] },
    { resource: "User", field: "role", permissions: [] },
    { resource: "Post", field: "title", permissions: ["Read"] },
    { resource: "Post", field: "body", permissions: ["Read"] },
    { resource: "Post", field: "author", permissions: ["Read"] },
    { resource: "Post", field: "publishedAt", permissions: ["Read"] },
  ],
};

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export const USERS: AppUser[] = [
  { id: "1", firstName: "Alice", lastName: "Admin", email: "alice@example.com", role: "Admin" },
  { id: "2", firstName: "Eddie", lastName: "Editor", email: "eddie@example.com", role: "Editor" },
  { id: "3", firstName: "Vince", lastName: "Viewer", email: "vince@example.com", role: "Viewer" },
];

export interface Post {
  id: string;
  title: string;
  body: string;
  author: string;
  publishedAt: Date | null;
}

export const POSTS: Post[] = [
  { id: "1", title: "First Post", body: "Hello world", author: "1", publishedAt: new Date("2024-01-15") },
  { id: "2", title: "Draft Post", body: "Work in progress", author: "2", publishedAt: null },
];

