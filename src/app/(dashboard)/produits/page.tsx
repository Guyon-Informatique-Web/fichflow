import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PlusCircle, Package, FileDown, CheckCircle2, Clock, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/config/plans";
import type { PlanType } from "@/config/plans";

export const metadata: Metadata = {
  title: "Mes produits",
};

const TONE_LABELS: Record<string, string> = {
  PROFESSIONNEL: "Pro",
  DECONTRACTE: "Décontracté",
  SENSUEL: "Sensuel",
  LUXE: "Luxe",
  PERSONNALISE: "Perso",
};

export default async function ProduitsPage() {
  const user = await getAuthUser();
  const canBulk = user.plan === "PRO" || user.role === "ADMIN";

  const products = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { exports: true } },
    },
  });

  const completed = products.filter(p => p.status === "COMPLETED").length;
  const drafts = products.filter(p => p.status !== "COMPLETED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes produits</h1>
          <p className="text-muted-foreground">
            {products.length} fiche{products.length !== 1 ? "s" : ""} créée{products.length !== 1 ? "s" : ""}
            {completed > 0 && ` · ${completed} terminée${completed !== 1 ? "s" : ""}`}
            {drafts > 0 && ` · ${drafts} brouillon${drafts !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex gap-2">
          {canBulk && (
            <Button variant="outline" asChild>
              <Link href="/produits/bulk" className="gap-2">
                <Layers className="h-4 w-4" />
                Générer en lot
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/produits/nouveau" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nouvelle fiche
            </Link>
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Aucun produit pour le moment</h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Créez votre première fiche produit en quelques clics.
              Prenez une photo et laissez l&apos;IA faire le reste.
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
              <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="p-4">
                  {/* Miniature photo */}
                  {product.photos.length > 0 ? (
                    <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.photos[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-muted">
                      <Package className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Titre généré ou nom */}
                  <h3 className="line-clamp-1 font-semibold">
                    {product.generatedTitle || product.customTitle || product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>

                  {/* Métadonnées */}
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {product.status === "COMPLETED" ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Terminée
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <Clock className="h-3 w-3" />
                          Brouillon
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {TONE_LABELS[product.tone] ?? product.tone}
                      </Badge>
                    </div>
                    {product._count.exports > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileDown className="h-3 w-3" />
                        {product._count.exports} PDF
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {format(new Date(product.createdAt), "dd MMM yyyy", { locale: fr })}
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
