import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PlusCircle, Package, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Mes produits",
};

export default async function ProduitsPage() {
  const user = await getAuthUser();

  const products = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { exports: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes produits</h1>
        <Button asChild>
          <Link href="/produits/nouveau" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nouvelle fiche
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">
              Aucun produit pour le moment
            </h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Créez votre première fiche produit en quelques clics. Prenez une
              photo et laissez l&apos;IA faire le reste.
            </p>
            <Button asChild>
              <Link href="/produits/nouveau" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Créer ma première fiche
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} href={`/produits/${product.id}`}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="p-4">
                  {/* Miniature photo */}
                  {product.photos.length > 0 && (
                    <div className="mb-3 aspect-square overflow-hidden rounded-md bg-muted">
                      <img
                        src={product.photos[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.category}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {product.price && (
                        <span className="font-medium">
                          {Number(product.price).toFixed(2)}€
                        </span>
                      )}
                      {product._count.exports > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileDown className="h-3 w-3" />
                          {product._count.exports}
                        </span>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        product.status === "COMPLETED"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {product.status === "COMPLETED"
                        ? "Terminée"
                        : "Brouillon"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {format(new Date(product.createdAt), "dd MMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
