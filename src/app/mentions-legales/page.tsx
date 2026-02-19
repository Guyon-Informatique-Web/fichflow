// Page mentions légales — obligation légale française
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentions légales — FichFlow",
  description: "Mentions légales du site FichFlow.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header simplifié */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FichFlow</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-bold">Mentions légales</h1>
        <p className="mt-2 text-muted-foreground">
          Dernière mise à jour : 19 février 2026
        </p>

        <Separator className="my-8" />

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Éditeur */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              1. Éditeur du site
            </h2>
            <p>
              Le site <strong className="text-foreground">fichflow.vercel.app</strong> est
              édité par :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Guyon Informatique &amp; Web</strong> —
                Micro-entreprise
              </li>
              <li>Dirigeant : Valentin Guyon</li>
              <li>SIRET : en cours d&apos;immatriculation</li>
              <li>Adresse : France</li>
              <li>
                Email :{" "}
                <a
                  href="mailto:contact@guyon-informatique-web.fr"
                  className="text-primary hover:underline"
                >
                  contact@guyon-informatique-web.fr
                </a>
              </li>
              <li>
                Site :{" "}
                <a
                  href="https://guyon-informatique-web.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  guyon-informatique-web.fr
                </a>
              </li>
            </ul>
          </section>

          {/* Directeur de publication */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              2. Directeur de la publication
            </h2>
            <p>Valentin Guyon, en qualité de gérant de Guyon Informatique &amp; Web.</p>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              3. Hébergement
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Application</strong> : Vercel Inc. — 340
                S Lemon Ave #4133, Walnut, CA 91789, États-Unis
              </li>
              <li>
                <strong className="text-foreground">Base de données</strong> : Supabase Inc.
                — 970 Toa Payoh North #07-04, Singapore 318992
              </li>
              <li>
                <strong className="text-foreground">Paiements</strong> : Stripe Inc. — 354
                Oyster Point Blvd, South San Francisco, CA 94080, États-Unis
              </li>
            </ul>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              4. Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu du site FichFlow (textes, images, logos, code
              source, design) est la propriété exclusive de Guyon Informatique &amp; Web,
              sauf mention contraire. Toute reproduction, même partielle, est interdite
              sans autorisation préalable.
            </p>
            <p className="mt-2">
              Les fiches produit générées par l&apos;utilisateur via le service lui
              appartiennent. FichFlow ne revendique aucun droit sur le contenu généré.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              5. Limitation de responsabilité
            </h2>
            <p>
              FichFlow utilise l&apos;intelligence artificielle pour générer du contenu.
              Les résultats sont fournis à titre indicatif et peuvent contenir des
              inexactitudes. L&apos;utilisateur reste seul responsable de la vérification
              et de l&apos;utilisation du contenu généré.
            </p>
            <p className="mt-2">
              Guyon Informatique &amp; Web ne saurait être tenu responsable des dommages
              directs ou indirects résultant de l&apos;utilisation du service.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              6. Cookies
            </h2>
            <p>
              Le site utilise uniquement des cookies strictement nécessaires au
              fonctionnement du service (authentification, session utilisateur). Aucun
              cookie publicitaire ou de traçage n&apos;est utilisé.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              7. Droit applicable
            </h2>
            <p>
              Le présent site est soumis au droit français. Tout litige relatif à son
              utilisation sera soumis aux tribunaux compétents de France.
            </p>
          </section>
        </div>
      </main>

      {/* Footer simplifié */}
      <footer className="border-t py-6">
        <div className="mx-auto max-w-4xl px-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Guyon Informatique &amp; Web. Tous droits
          réservés.
        </div>
      </footer>
    </div>
  );
}
