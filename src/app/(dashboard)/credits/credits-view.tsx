"use client";

import { useState } from "react";
import Link from "next/link";
import { Coins, Loader2, History } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CREDIT_PACKS } from "@/lib/constants";

interface CreditsViewProps {
  credits: number;
  userId: string;
}

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

      // Rediriger vers Stripe Checkout
      window.location.href = url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur inattendue."
      );
      setLoadingPack(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crédits</h1>
        <p className="text-muted-foreground">
          1 crédit = 1 fiche produit complète (génération + export)
        </p>
      </div>

      {/* Solde actuel */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Coins className="h-6 w-6 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">Votre solde</p>
              <p className="text-2xl font-bold">
                {credits} crédit{credits !== 1 ? "s" : ""}
              </p>
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

      {/* Packs de crédits */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CREDIT_PACKS.map((pack) => (
          <Card key={pack.id} className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{pack.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-3xl font-bold">{pack.credits}</p>
              <p className="text-sm text-muted-foreground">crédits</p>
              <p className="text-2xl font-bold">{pack.price}€</p>
              <p className="text-xs text-muted-foreground">
                {(pack.price / pack.credits).toFixed(2)}€ / fiche
              </p>
              <Button
                className="w-full"
                onClick={() => handleBuy(pack.id)}
                disabled={loadingPack !== null}
              >
                {loadingPack === pack.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirection...
                  </>
                ) : (
                  "Acheter"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
