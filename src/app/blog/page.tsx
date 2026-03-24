import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog — Conseils fiches produit, e-commerce et IA",
  description:
    "Découvrez nos guides et conseils pour créer des fiches produit qui convertissent. IA, e-commerce, SEO produit.",
  openGraph: {
    title: "Blog FichFlow — Fiches produit, e-commerce et IA",
    description:
      "Guides pratiques pour créer des fiches produit professionnelles.",
  },
};

const ARTICLES = [
  {
    slug: "comment-creer-fiche-produit-qui-vend",
    title: "Comment créer une fiche produit qui vend (guide 2026)",
    excerpt:
      "Une bonne fiche produit, c'est 80% de la conversion. Voici les 7 éléments indispensables pour transformer un visiteur en acheteur.",
    date: "24 mars 2026",
    readTime: "5 min",
    category: "E-commerce",
  },
  {
    slug: "ia-generative-fiches-produit",
    title: "L'IA générative au service de vos fiches produit",
    excerpt:
      "Comment l'intelligence artificielle peut analyser une photo et rédiger une description produit professionnelle en 30 secondes.",
    date: "22 mars 2026",
    readTime: "4 min",
    category: "IA",
  },
  {
    slug: "optimiser-photos-produit-e-commerce",
    title: "Optimiser ses photos produit pour l'e-commerce",
    excerpt:
      "Éclairage, cadrage, fond — les bonnes pratiques pour des photos qui mettent en valeur vos produits et alimentent l'IA.",
    date: "20 mars 2026",
    readTime: "6 min",
    category: "Photographie",
  },
  {
    slug: "etsy-vinted-pro-fiches-produit",
    title: "Vendre sur Etsy et Vinted Pro : l'importance des fiches produit",
    excerpt:
      "Sur les marketplaces, la fiche produit fait la différence. Voici comment se démarquer avec des descriptions pro.",
    date: "18 mars 2026",
    readTime: "5 min",
    category: "Marketplace",
  },
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FichFlow</span>
          </Link>
          <Button size="sm" asChild>
            <Link href="/inscription">
              Essai gratuit <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Guides et conseils pour créer des fiches produit qui convertissent
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`}>
            <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                    {article.category}
                  </span>
                  <span className="text-muted-foreground">{article.readTime}</span>
                </div>
                <h2 className="mb-2 text-lg font-semibold leading-tight group-hover:text-primary">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                <p className="mt-3 text-xs text-muted-foreground">{article.date}</p>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl border bg-primary/5 p-8 text-center">
          <h2 className="text-xl font-bold">
            Créez votre première fiche produit gratuitement
          </h2>
          <p className="mt-2 text-muted-foreground">
            3 crédits offerts — aucune carte bancaire requise
          </p>
          <Button className="mt-4" asChild>
            <Link href="/inscription">
              Commencer maintenant <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-4xl px-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Guyon Informatique &amp; Web
        </div>
      </footer>
    </div>
  );
}
