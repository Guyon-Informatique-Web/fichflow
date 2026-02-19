import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Paiement annulé",
};

export default function AnnulePage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <XCircle className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Paiement annulé</h1>
          <p className="text-muted-foreground">
            Votre paiement a été annulé. Aucun montant n&apos;a été débité.
          </p>
          <Button asChild>
            <Link href="/credits">Retour aux crédits</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
