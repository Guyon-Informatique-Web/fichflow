import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, Coins, Package, FileDown, TrendingUp, Clock, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/config/plans";
import type { PlanType } from "@/config/plans";

export const metadata: Metadata = {
  title: "Dashboard",
};

const PLAN_LABELS: Record<PlanType, string> = {
  FREE: "Gratuit",
  ARTISAN: "Artisan",
  PRO: "Pro",
};

const PLAN_COLORS: Record<PlanType, string> = {
  FREE: "secondary",
  ARTISAN: "default",
  PRO: "default",
};

export default async function DashboardPage() {
  const user = await getAuthUser();
  const plan = user.plan as PlanType;
  const planConfig = PLANS[plan];
  const creditLimit = planConfig.limits.monthlyCredits;

  // Récupérer les stats + dernières fiches en parallèle
  const [productCount, exportCount, recentProducts] = await Promise.all([
    prisma.product.count({ where: { userId: user.id } }),
    prisma.exportHistory.count({
      where: { product: { userId: user.id } },
    }),
    prisma.product.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        tone: true,
        createdAt: true,
        _count: { select: { exports: true } },
      },
    }),
  ]);

  const creditPercentage = creditLimit > 0
    ? Math.min(100, Math.round((user.credits / creditLimit) * 100))
    : null;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 60) return `il y a ${diff}min`;
    if (diff < 1440) return `il y a ${Math.floor(diff / 60)}h`;
    return `il y a ${Math.floor(diff / 1440)}j`;
  };

  const TONE_LABELS: Record<string, string> = {
    PROFESSIONNEL: "Pro",
    DECONTRACTE: "Décontracté",
    SENSUEL: "Sensuel",
    LUXE: "Luxe",
    PERSONNALISE: "Perso",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bonjour{user.name ? `, ${user.name}` : ""} 👋
          </p>
        </div>
        <Button asChild>
          <Link href="/produits/nouveau" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nouvelle fiche
          </Link>
        </Button>
      </div>

      {/* Alerte crédits faibles */}
      {user.credits <= 1 && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <Zap className="h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-600 dark:text-amber-400">
            {user.credits === 0
              ? "Plus de crédits disponibles. "
              : "Il vous reste 1 crédit. "}
            <Link href="/credits" className="font-semibold underline">
              Recharger maintenant
            </Link>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Plan */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plan actuel</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <span className="text-2xl font-bold">{PLAN_LABELS[plan]}</span>
            {plan === "FREE" && (
              <Link href="/abonnement" className="ml-auto">
                <Badge variant="outline" className="cursor-pointer border-primary/50 text-primary hover:bg-primary/10">
                  Upgrade
                </Badge>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Crédits avec barre de progression */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Crédits restants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{user.credits}</span>
              {creditLimit > 0 && (
                <span className="text-sm text-muted-foreground">/ {creditLimit}</span>
              )}
              {user.credits === 0 && (
                <Link href="/credits" className="ml-auto text-xs text-primary underline">
                  Acheter
                </Link>
              )}
            </div>
            {creditPercentage !== null && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    creditPercentage > 30 ? "bg-primary" : creditPercentage > 10 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${creditPercentage}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fiches créées */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fiches créées</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{productCount}</span>
          </CardContent>
        </Card>

        {/* Exports */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">PDF exportés</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{exportCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      {productCount === 0 ? (
        /* Onboarding état vide */
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Prêt à créer votre première fiche ?</h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Prenez une photo de votre produit, choisissez un ton et laissez l&apos;IA
              générer une fiche professionnelle en quelques secondes.
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
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Dernières fiches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Dernières fiches</CardTitle>
              </div>
              <Link href="/produits" className="flex items-center gap-1 text-xs text-primary hover:underline">
                Voir tout <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentProducts.map((product) => (
                <Link key={product.id} href={`/produits/${product.id}`}>
                  <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{product.title || "Sans titre"}</p>
                      <p className="text-xs text-muted-foreground">
                        {TONE_LABELS[product.tone] ?? product.tone} · {formatDate(product.createdAt)}
                      </p>
                    </div>
                    {product._count.exports > 0 && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {product._count.exports} PDF
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Actions rapides</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start gap-2" asChild>
                  <Link href="/produits/nouveau">
                    <PlusCircle className="h-4 w-4" />
                    Nouvelle fiche
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link href="/produits">
                    <Package className="h-4 w-4" />
                    Mes produits ({productCount})
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link href="/credits">
                    <Coins className="h-4 w-4" />
                    Acheter des crédits
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Upgrade si FREE */}
            {plan === "FREE" && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-4">
                  <p className="text-sm font-semibold">Passez à Artisan</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    20 crédits/mois, 3 photos/produit, export texte
                  </p>
                  <Button size="sm" className="mt-3 w-full" asChild>
                    <Link href="/abonnement">Voir les plans</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
