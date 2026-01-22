"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Address, UserProfile, UserProfileArgs } from "@/types/user-profile";
import ClientModel, { ModelEndpoints } from "@/lib/client/client-model";

const mockUser: UserProfile = {
  id: "123",
  firstName: "John",
  lastName: "Framework",
  age: 21,
  address: {
    street: "123 John Street",
    city: "Cleveland",
    state: "Ohio",
  },
  documents: [
    { name: "Document 1", url: "/url/document_1", valid: true },
    { name: "Document 2", url: "/url/document_2", valid: true },
    { name: "Document 3", url: "/url/document_3", valid: false },
  ],
};

export function UserProfileCard() {
  const [user] = useState<UserProfile>(mockUser)
  const [editing, setEditing] = useState(false);
  const [canEdit] = useState<boolean>(true);
  const [canViewDocuments] = useState<boolean>(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Profile</CardTitle>
        {canEdit && (
          <Button
            variant={editing ? "default" : "outline"}
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Save" : "Edit"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="ID" value={user.id} />
          <Field
            label="First Name"
            value={formData.firstName}
            editing={editing && canEdit}
            onChange={(v) => handleChange("firstName", v)}
          />
          <Field
            label="Last Name"
            value={formData.lastName}
            editing={editing && canEdit}
            onChange={(v) => handleChange("lastName", v)}
          />
          <Field
            label="Age"
            value={formData.age}
            editing={editing && canEdit}
            onChange={(v) => handleChange("age", parseInt(v) || 0)}
            type="number"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Address</h3>
          <div className="grid grid-cols-3 gap-4">
            <Field
              label="Street"
              value={formData.address.street}
              editing={editing && canEdit}
              onChange={(v) => handleAddressChange("street", v)}
            />
            <Field
              label="City"
              value={formData.address.city}
              editing={editing && canEdit}
              onChange={(v) => handleAddressChange("city", v)}
            />
            <Field
              label="State"
              value={formData.address.state}
              editing={editing && canEdit}
              onChange={(v) => handleAddressChange("state", v)}
            />
          </div>
        </div>

        {canViewDocuments && user.documents.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Documents</h3>
            <div className="space-y-2">
              {user.documents.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <span className="text-sm">{doc.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={doc.valid ? "default" : "destructive"}>
                      {doc.valid ? "Valid" : "Invalid"}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={doc.url}>View</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!canViewDocuments && (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            You do not have permission to view documents.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  editing = false,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  editing?: boolean;
  onChange?: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      {editing && onChange ? (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="text-sm font-medium">{value}</p>
      )}
    </div>
  );
}
