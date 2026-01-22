"use client";

import { useState } from "react";
import { UserProfileCard } from "@/components/user-profile";
import { Button } from "@/components/ui/button";

type Role = "Admin" | "User";

const rolePermissions: Record<Role, { canEdit: boolean; canViewDocuments: boolean }> = {
  Admin: { canEdit: true, canViewDocuments: true },
  User: { canEdit: false, canViewDocuments: false },
};

export default function Home() {
  const [role, setRole] = useState<Role>("User");
  const permissions = rolePermissions[role];

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 p-8 dark:bg-black">
      <div className="mb-8 flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Viewing as:</span>
        <div className="flex gap-2">
          {(["User", "Admin"] as Role[]).map((r) => (
            <Button
              key={r}
              variant={role === r ? "default" : "outline"}
              size="sm"
              onClick={() => setRole(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>
      <UserProfileCard />
    </div>
  );
}
