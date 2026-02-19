import type { Metadata } from "next";
import { getAuthUser } from "@/lib/auth";
import { NouveauProduitForm } from "./form";

export const metadata: Metadata = {
  title: "Nouvelle fiche produit",
};

export default async function NouveauProduitPage() {
  const user = await getAuthUser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouvelle fiche produit</h1>
        <p className="text-muted-foreground">
          Uploadez une photo et renseignez les informations de base pour générer
          votre fiche produit.
        </p>
      </div>

      <NouveauProduitForm credits={user.credits} />
    </div>
  );
}
