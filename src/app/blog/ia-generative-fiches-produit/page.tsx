import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "L'IA générative au service de vos fiches produit",
  description:
    "Comment l'intelligence artificielle analyse une photo et rédige une description produit professionnelle en 30 secondes. Guide complet.",
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
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">IA</span>
            <span className="text-muted-foreground">4 min de lecture</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            L&apos;IA générative au service de vos fiches produit
          </h1>
          <p className="mt-3 text-muted-foreground">22 mars 2026 · Guyon Informatique &amp; Web</p>

          <Separator className="my-8" />

          <div className="space-y-6 text-base leading-relaxed">
            <p className="text-lg">
              Rédiger une fiche produit prend en moyenne <strong>30 à 45 minutes</strong>. Avec 50 produits à cataloguer,
              c&apos;est 25 heures de travail. L&apos;IA générative change la donne : <strong>30 secondes par fiche</strong>, avec
              une qualité souvent supérieure à une rédaction manuelle.
            </p>

            <h2 className="text-2xl font-bold">Comment ça fonctionne ?</h2>
            <p>
              Les modèles d&apos;IA de vision (comme Claude d&apos;Anthropic) analysent votre photo et identifient automatiquement :
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Les <strong className="text-foreground">couleurs et matières</strong> (cuir, bois, tissu...)</li>
              <li>La <strong className="text-foreground">forme et les dimensions</strong> estimées</li>
              <li>Le <strong className="text-foreground">style et la catégorie</strong> du produit</li>
              <li>Les <strong className="text-foreground">détails distinctifs</strong> (fermetures, motifs, finitions)</li>
            </ul>

            <h2 className="text-2xl font-bold">Une photo suffit, plusieurs c&apos;est mieux</h2>
            <p>
              Avec une seule photo, l&apos;IA produit déjà une fiche complète. Avec 2 ou 3 photos sous différents angles, la description
              s&apos;enrichit considérablement : l&apos;IA détecte des détails invisibles sur une seule vue.
            </p>

            <h2 className="text-2xl font-bold">Le ton fait la différence</h2>
            <p>
              Un même produit peut être décrit de 4 façons radicalement différentes :
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="mb-1 text-sm font-semibold text-blue-400">💼 Professionnel</p>
                <p className="text-sm text-muted-foreground">&quot;Chaise ergonomique en chêne massif. Finitions soignées pour un usage quotidien.&quot;</p>
              </div>
              <div className="rounded-lg border border-pink-500/20 bg-pink-500/5 p-4">
                <p className="mb-1 text-sm font-semibold text-pink-400">✨ Sensuel</p>
                <p className="text-sm text-muted-foreground">&quot;La courbe du bois épouse vos formes. Une invitation au confort.&quot;</p>
              </div>
              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <p className="mb-1 text-sm font-semibold text-green-400">😎 Décontracté</p>
                <p className="text-sm text-muted-foreground">&quot;Une chaise trop sympa qui va cartonner dans votre salon !&quot;</p>
              </div>
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <p className="mb-1 text-sm font-semibold text-yellow-400">👑 Luxe</p>
                <p className="text-sm text-muted-foreground">&quot;Pièce d&apos;exception en chêne sélectionné. Artisanat d&apos;excellence.&quot;</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold">ROI concret</h2>
            <p>Prenons un vendeur Etsy avec 100 produits :</p>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p><strong>Sans IA :</strong> 100 × 30 min = 50 heures de rédaction</p>
              <p><strong>Avec FichFlow :</strong> 100 × 30 sec = 50 minutes + vérification</p>
              <p className="mt-2 font-semibold text-primary">Gain : ~48 heures de travail</p>
            </div>

            <h2 className="text-2xl font-bold">Les limites à connaître</h2>
            <p>
              L&apos;IA n&apos;est pas parfaite. Elle peut se tromper sur un matériau ou inventer un détail invisible sur la photo.
              C&apos;est pourquoi chaque fiche reste <strong>entièrement modifiable</strong> avant export. L&apos;IA rédige, vous validez.
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold">Essayez par vous-même</h2>
            <p>
              <Link href="/inscription" className="text-primary font-semibold hover:underline">FichFlow</Link> vous offre
              3 crédits gratuits pour tester la génération IA. Uploadez une photo, choisissez votre ton, et jugez par vous-même.
            </p>
          </div>
        </article>

        <div className="mt-12 rounded-xl border bg-primary/5 p-8 text-center">
          <h3 className="text-xl font-bold">Testez l&apos;IA sur votre propre produit</h3>
          <p className="mt-2 text-muted-foreground">3 crédits offerts — résultat en 30 secondes</p>
          <Button className="mt-4" asChild>
            <Link href="/inscription">
              Essayer maintenant <ArrowRight className="ml-2 h-4 w-4" />
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
