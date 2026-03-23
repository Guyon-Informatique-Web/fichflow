"use client";

import { useState } from "react";
import Link from "next/link";
import { Coins, Loader2, History, Zap, Star } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CREDIT_PACKS } from "@/lib/constants";

interface CreditsViewProps {
  credits: number;
  userId: string;
}

// Le pack "meilleure valeur" — le plus grand
const BEST_VALUE_ID = CREDIT_PACKS[CREDIT_PACKS.length - 1]?.id;
const POPULAR_ID = CREDIT_PACKS[Math.floor(CREDIT_PACKS.length / 2)]?.id;

export function CreditsView({ credits }: CreditsViewProps) {
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  async function handleBuy(packId: string) {
    setLoadingPack(packId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors du paiement.");
      }
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inattendue.");
      setLoadingPack(null);
    }
  }

  const pricePerCredit = (price: number, credits: number) =>
    (price / credits).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crédits</h1>
        <p className="text-muted-foreground">
          1 crédit = 1 fiche produit complète (génération IA + export PDF)
        </p>
      </div>

      {/* Solde + alerte */}
      <Card className={credits === 0 ? "border-amber-500/30 bg-amber-500/5" : ""}>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Coins className={`h-6 w-6 ${credits === 0 ? "text-amber-500" : "text-amber-500"}`} />
            <div>
              <p className="text-sm text-muted-foreground">Votre solde actuel</p>
              <p className="text-2xl font-bold">
                {credits} crédit{credits !== 1 ? "s" : ""}
              </p>
              {credits === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Plus de crédits — rechargez pour continuer
                </p>
              )}
              {credits > 0 && credits <= 3 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Bientôt à court — pensez à recharger
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/credits/historique">
              <History className="mr-2 h-4 w-4" />
              Historique
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Packs */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Choisissez un pack</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKS.map((pack) => {
            const isBestValue = pack.id === BEST_VALUE_ID;
            const isPopular = pack.id === POPULAR_ID;
            return (
              <Card
                key={pack.id}
                className={`relative text-center transition-all hover:shadow-md ${
                  isBestValue ? "border-primary ring-1 ring-primary/20" : ""
                }`}
              >
                {isBestValue && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1 bg-primary px-2 py-0.5 text-xs">
                      <Star className="h-3 w-3" /> Meilleure valeur
                    </Badge>
                  </div>
                )}
                {isPopular && !isBestValue && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="secondary" className="gap-1 px-2 py-0.5 text-xs">
                      <Zap className="h-3 w-3" /> Populaire
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-base">{pack.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pb-5">
                  <div>
                    <p className="text-4xl font-bold">{pack.credits}</p>
                    <p className="text-sm text-muted-foreground">crédits</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pack.price}€</p>
                    <p className="text-xs text-muted-foreground">
                      soit {pricePerCredit(pack.price, pack.credits)}€ / fiche
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    variant={isBestValue ? "default" : "outline"}
                    onClick={() => handleBuy(pack.id)}
                    disabled={loadingPack !== null}
                  >
                    {loadingPack === pack.id ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Redirection...</>
                    ) : (
                      "Acheter"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Rappel */}
      <p className="text-center text-sm text-muted-foreground">
        Les crédits n&apos;expirent jamais. Paiement sécurisé via Stripe.{" "}
        <Link href="/abonnement" className="text-primary underline">
          Découvrir les abonnements mensuels
        </Link>
      </p>
    </div>
  );
}
