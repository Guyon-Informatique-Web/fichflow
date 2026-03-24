import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Comment créer une fiche produit qui vend (guide 2026)",
  description:
    "Les 7 éléments indispensables d'une fiche produit e-commerce qui convertit. Titre, description, photos, caractéristiques — tout ce qu'il faut savoir.",
  openGraph: {
    title: "Comment créer une fiche produit qui vend",
    description: "Guide complet 2026 pour des fiches produit qui convertissent.",
  },
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
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">E-commerce</span>
            <span className="text-muted-foreground">5 min de lecture</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            Comment créer une fiche produit qui vend (guide 2026)
          </h1>
          <p className="mt-3 text-muted-foreground">24 mars 2026 · Guyon Informatique &amp; Web</p>

          <Separator className="my-8" />

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-lg leading-relaxed">
              Une bonne fiche produit, c&apos;est <strong>80% de la conversion</strong> en e-commerce. Pourtant, la plupart des vendeurs négligent
              cette étape et se retrouvent avec des descriptions vides, des photos floues et zéro vente. Voici les 7 éléments qui font la différence.
            </p>

            <h2 className="text-2xl font-bold">1. Un titre optimisé SEO</h2>
            <p>
              Le titre est la première chose que Google et vos clients voient. Il doit contenir le <strong>nom du produit</strong>,
              sa <strong>caractéristique principale</strong> (matière, couleur, taille) et un <strong>bénéfice</strong>.
            </p>
            <p className="rounded-lg border bg-muted/30 p-4 text-sm">
              ❌ &quot;Sac en cuir&quot;<br/>
              ✅ &quot;Sac cabas en cuir grainé camel — Grand format, fermeture zip&quot;
            </p>

            <h2 className="text-2xl font-bold">2. Des photos qui donnent envie</h2>
            <p>
              Minimum 3 photos : une vue d&apos;ensemble, un détail de matière, et une mise en situation. Fond blanc ou neutre pour
              les marketplaces, lifestyle pour votre propre boutique.
            </p>

            <h2 className="text-2xl font-bold">3. Une description qui raconte une histoire</h2>
            <p>
              Oubliez les bullet points secs. Décrivez <strong>l&apos;expérience</strong> du produit : comment il se sent au toucher,
              dans quel contexte on l&apos;utilise, quel problème il résout. Adaptez le ton à votre cible.
            </p>

            <h2 className="text-2xl font-bold">4. Des caractéristiques techniques complètes</h2>
            <p>
              Matière, dimensions, poids, coloris disponibles, entretien. Plus vous êtes précis, moins vous aurez de retours.
              C&apos;est aussi ce que Google indexe pour le Shopping.
            </p>

            <h2 className="text-2xl font-bold">5. Un prix clair et visible</h2>
            <p>
              Pas de surprise. Le prix TTC doit être visible immédiatement. Si vous proposez des réductions, affichez le prix barré
              et le pourcentage de remise.
            </p>

            <h2 className="text-2xl font-bold">6. Des avis clients</h2>
            <p>
              88% des consommateurs font autant confiance aux avis en ligne qu&apos;aux recommandations personnelles.
              Même 3-5 avis suffisent pour crédibiliser votre fiche.
            </p>

            <h2 className="text-2xl font-bold">7. Un appel à l&apos;action clair</h2>
            <p>
              &quot;Ajouter au panier&quot;, &quot;Commander maintenant&quot;, &quot;Essayer gratuitement&quot; — un seul CTA, visible, contrasté.
              Pas de distraction.
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold">Et si l&apos;IA faisait tout ça pour vous ?</h2>
            <p>
              Avec <Link href="/" className="text-primary font-semibold hover:underline">FichFlow</Link>, uploadez une photo de votre produit
              et obtenez en 30 secondes : titre optimisé, description engageante, caractéristiques détaillées et export PDF professionnel.
              <strong> 3 crédits offerts pour essayer.</strong>
            </p>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-xl border bg-primary/5 p-8 text-center">
          <h3 className="text-xl font-bold">Créez votre première fiche produit en 30 secondes</h3>
          <p className="mt-2 text-muted-foreground">Gratuit — aucune carte bancaire requise</p>
          <Button className="mt-4" asChild>
            <Link href="/inscription">
              Commencer maintenant <ArrowRight className="ml-2 h-4 w-4" />
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
