import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Paiement réussi",
};

interface Props {
  searchParams: Promise<{ credits?: string }>;
}

export default async function SuccesPage({ searchParams }: Props) {
  const { credits: creditsParam } = await searchParams;
  const user = await getAuthUser();
  const creditsAdded = creditsParam ? parseInt(creditsParam, 10) : 0;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-bold">Paiement réussi !</h1>
          {creditsAdded > 0 && (
            <p className="text-muted-foreground">
              {creditsAdded} crédit{creditsAdded !== 1 ? "s" : ""} ajouté
              {creditsAdded !== 1 ? "s" : ""} à votre compte.
            </p>
          )}
          <p className="text-lg font-semibold">
            Solde actuel : {user.credits} crédit{user.credits !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/produits/nouveau">Créer une fiche</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/credits">Retour aux crédits</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
