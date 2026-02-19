import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, Coins, Package, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getAuthUser();

  // Récupérer les stats en parallèle
  const [productCount, exportCount] = await Promise.all([
    prisma.product.count({ where: { userId: user.id } }),
    prisma.exportHistory.count({
      where: { product: { userId: user.id } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenue{user.name ? `, ${user.name}` : ""} !
          </p>
        </div>
        <Button asChild>
          <Link href="/produits/nouveau" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nouvelle fiche
          </Link>
        </Button>
      </div>

      {/* Résumé rapide */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Crédits restants
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            <span className="text-2xl font-bold">{user.credits}</span>
            {user.credits === 0 && (
              <Link href="/credits" className="ml-auto text-xs text-primary underline">
                Acheter
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fiches créées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{productCount}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{exportCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* Appel à l'action si aucun produit */}
      {productCount === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">
              Prêt à créer votre première fiche ?
            </h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Prenez une photo de votre produit, choisissez un ton et laissez
              l&apos;IA générer une fiche professionnelle en quelques secondes.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/produits/nouveau" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Créer ma première fiche
                </Link>
              </Button>
              {user.credits === 0 && (
                <Button variant="outline" asChild>
                  <Link href="/credits" className="gap-2">
                    <Coins className="h-4 w-4" />
                    Acheter des crédits
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raccourcis quand l'utilisateur a déjà des produits */}
      {productCount > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/produits">
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-full bg-muted p-3">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Voir mes produits</p>
                  <p className="text-sm text-muted-foreground">
                    {productCount} fiche{productCount !== 1 ? "s" : ""} créée{productCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/produits/nouveau">
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-full bg-muted p-3">
                  <FileDown className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Nouvelle fiche</p>
                  <p className="text-sm text-muted-foreground">
                    Générer avec l&apos;IA
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
