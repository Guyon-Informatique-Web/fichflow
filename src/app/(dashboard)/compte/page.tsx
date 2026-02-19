import type { Metadata } from "next";
import { getAuthUser } from "@/lib/auth";
import { AccountForm } from "./account-form";

export const metadata: Metadata = {
  title: "Mon compte",
};

export default async function ComptePage() {
  const user = await getAuthUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mon compte</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles
        </p>
      </div>

      <AccountForm
        email={user.email}
        name={user.name ?? ""}
        role={user.role}
        createdAt={user.createdAt.toISOString()}
      />
    </div>
  );
}
