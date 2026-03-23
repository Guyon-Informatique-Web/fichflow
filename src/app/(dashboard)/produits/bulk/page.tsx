import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth";
import { BulkGenerateForm } from "./form";

export const metadata: Metadata = {
  title: "Génération en lot",
};

export default async function BulkPage() {
  const user = await getAuthUser();
  const canBulk = user.plan === "PRO" || user.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/produits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Génération en lot</h1>
          <p className="text-muted-foreground">
            Générez plusieurs fiches produit en une seule fois
          </p>
        </div>
      </div>

      {!canBulk ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Fonctionnalité Pro</h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              La génération en lot est disponible uniquement avec le plan Pro.
              Générez jusqu&apos;à 10 fiches simultanément.
            </p>
            <Button asChild>
              <Link href="/abonnement">Passer au plan Pro</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <BulkGenerateForm credits={user.credits} />
      )}
    </div>
  );
}
