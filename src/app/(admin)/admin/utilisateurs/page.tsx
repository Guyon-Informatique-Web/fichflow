import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "./users-table";

export const metadata: Metadata = {
  title: "Utilisateurs",
};

export default async function UtilisateursPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  // Sérialiser les dates pour le composant client
  const serializedUsers = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    credits: u.credits,
    createdAt: u.createdAt.toISOString(),
    productCount: u._count.products,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Utilisateurs</h1>
        <p className="text-muted-foreground">
          Gérez les utilisateurs de FichFlow
        </p>
      </div>

      <UsersTable users={serializedUsers} />
    </div>
  );
}
