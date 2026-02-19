import type { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Users, FileText, Coins, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Vue d'ensemble",
};

export default async function AdminDashboardPage() {
  // Récupérer les stats en parallèle
  const [totalUsers, totalProducts, purchaseCredits, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.creditTransaction.aggregate({
        where: { type: "PURCHASE" },
        _sum: { amount: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, email: true, name: true, createdAt: true, credits: true },
      }),
    ]);

  const totalPurchasedCredits = purchaseCredits._sum.amount ?? 0;
  // Estimation revenus basée sur le prix moyen par crédit (~0.20€)
  const estimatedRevenue = (totalPurchasedCredits * 0.2).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vue d&apos;ensemble</h1>
        <p className="text-muted-foreground">
          Statistiques globales de FichFlow
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fiches créées
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Crédits achetés
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalPurchasedCredits}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus estimés
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{estimatedRevenue}€</p>
          </CardContent>
        </Card>
      </div>

      {/* Dernières inscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières inscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun utilisateur pour le moment.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Crédits</TableHead>
                  <TableHead>Inscrit le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>{u.name ?? "—"}</TableCell>
                    <TableCell>{u.credits}</TableCell>
                    <TableCell>
                      {format(new Date(u.createdAt), "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
