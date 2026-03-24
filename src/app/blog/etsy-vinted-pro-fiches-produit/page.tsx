import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Vendre sur Etsy et Vinted Pro : l'importance des fiches produit",
  description:
    "Sur les marketplaces, la fiche produit fait la différence entre un achat et un scroll. Voici comment se démarquer avec des descriptions professionnelles.",
};

export default function ArticlePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FichFlow</span>
          </Link>
          <Button size="sm" asChild>
            <Link href="/inscription">Essai gratuit</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl flex-1 px-4 py-12">
        <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour au blog
        </Link>

        <article>
          <div className="mb-2 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">Marketplace</span>
            <span className="text-muted-foreground">5 min de lecture</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            Vendre sur Etsy et Vinted Pro : l&apos;importance des fiches produit
          </h1>
          <p className="mt-3 text-muted-foreground">18 mars 2026 · Guyon Informatique &amp; Web</p>

          <Separator className="my-8" />

          <div className="space-y-6 text-base leading-relaxed">
            <p className="text-lg">
              Sur Etsy, Vinted Pro ou Amazon Handmade, vous êtes en compétition avec des milliers de vendeurs.
              La seule chose qui vous différencie ? <strong>Votre fiche produit.</strong>
            </p>

            <h2 className="text-2xl font-bold">Le problème des fiches bâclées</h2>
            <p>
              La majorité des vendeurs marketplace commettent les mêmes erreurs :
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Titre avec juste le nom du produit (<em>&quot;Boucles d&apos;oreilles&quot;</em>)</li>
              <li>Description de 2 lignes copiée-collée</li>
              <li>Photos floues prises au téléphone</li>
              <li>Aucune caractéristique technique</li>
            </ul>
            <p>
              Résultat : l&apos;algorithme ne les met pas en avant, et les acheteurs scrollent sans s&apos;arrêter.
            </p>

            <h2 className="text-2xl font-bold">Ce que les algorithmes veulent</h2>
            <p>
              Etsy et Vinted Pro utilisent des algorithmes de recherche basés sur <strong>la pertinence textuelle</strong>.
              Plus votre fiche est riche en mots-clés naturels, mieux elle se classe.
            </p>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <p><strong>Etsy :</strong> titre (140 caractères), 13 tags, attributs, description longue</p>
              <p><strong>Vinted Pro :</strong> titre, description détaillée, état, marque, taille, couleur</p>
              <p><strong>Amazon Handmade :</strong> bullet points, A+ Content, backend keywords</p>
            </div>

            <h2 className="text-2xl font-bold">La méthode : photo → IA → fiche pro</h2>
            <p>
              Au lieu de rédiger manuellement chaque fiche (30-45 min), utilisez l&apos;IA pour générer
              une première version complète en 30 secondes. Vous n&apos;avez plus qu&apos;à ajuster et personnaliser.
            </p>
            <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
              <li className="text-foreground"><strong>Prenez une bonne photo</strong> — fond neutre, éclairage naturel</li>
              <li className="text-foreground"><strong>Uploadez sur FichFlow</strong> — choisissez le ton adapté à votre marque</li>
              <li className="text-foreground"><strong>Récupérez titre + description + caractéristiques</strong></li>
              <li className="text-foreground"><strong>Copiez-collez dans votre marketplace</strong></li>
            </ol>

            <h2 className="text-2xl font-bold">Cas concret : bijoux artisanaux sur Etsy</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <p className="mb-2 text-sm font-bold text-red-400">❌ Avant</p>
                <p className="text-sm text-muted-foreground">
                  &quot;Boucles d&apos;oreilles dorées. Fait main.&quot;
                </p>
              </div>
              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <p className="mb-2 text-sm font-bold text-green-400">✅ Après (IA)</p>
                <p className="text-sm text-muted-foreground">
                  &quot;Boucles d&apos;oreilles pendantes en laiton doré martelé — Fermoir à crochet hypoallergénique, longueur 4 cm.
                  Finitions artisanales soignées, chaque paire est unique. Idéales pour un look bohème chic au quotidien.&quot;
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold">L&apos;avantage PDF pour les pros</h2>
            <p>
              Si vous travaillez avec des revendeurs ou en B2B, le PDF exporté par FichFlow sert de <strong>catalogue produit</strong>
              prêt à envoyer. Plus besoin de créer des fiches à la main dans Word.
            </p>

            <Separator className="my-8" />

            <p className="text-lg font-semibold">
              Vous vendez sur une marketplace ? Essayez{" "}
              <Link href="/inscription" className="text-primary hover:underline">FichFlow gratuitement</Link>
              {" "}— 3 crédits offerts, export PDF inclus.
            </p>
          </div>
        </article>

        <div className="mt-12 rounded-xl border bg-primary/5 p-8 text-center">
          <h3 className="text-xl font-bold">Boostez vos ventes marketplace</h3>
          <p className="mt-2 text-muted-foreground">Des fiches produit pro en 30 secondes</p>
          <Button className="mt-4" asChild>
            <Link href="/inscription">
              Essayer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Guyon Informatique &amp; Web
        </div>
      </footer>
    </div>
  );
}
