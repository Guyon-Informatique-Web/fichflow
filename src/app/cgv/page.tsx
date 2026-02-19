// Page conditions générales de vente
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — FichFlow",
  description: "Conditions générales de vente du service FichFlow.",
};

export default function CGVPage() {
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
        <h1 className="text-3xl font-bold">Conditions Générales de Vente</h1>
        <p className="mt-2 text-muted-foreground">
          Dernière mise à jour : 19 février 2026
        </p>

        <Separator className="my-8" />

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Objet */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent
              l&apos;utilisation du service <strong className="text-foreground">FichFlow</strong>,
              édité par Guyon Informatique &amp; Web, et l&apos;achat de packs de crédits
              permettant la génération de fiches produit par intelligence artificielle.
            </p>
          </section>

          {/* Fonctionnement du service */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              2. Fonctionnement du service
            </h2>
            <p>
              FichFlow permet aux utilisateurs de générer des fiches produit
              professionnelles à partir de photos et d&apos;informations saisies.
              Le service utilise l&apos;intelligence artificielle pour analyser les images
              et produire du contenu textuel (titre, description, caractéristiques).
            </p>
            <p className="mt-2">
              Chaque génération de fiche consomme <strong className="text-foreground">1 crédit</strong>.
              Les crédits sont acquis soit gratuitement à l&apos;inscription (3 crédits
              offerts), soit par achat de packs.
            </p>
          </section>

          {/* Packs de crédits */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              3. Packs de crédits et tarifs
            </h2>
            <p>Les packs de crédits disponibles sont les suivants :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Starter</strong> — 10 crédits : 4,90 € TTC
              </li>
              <li>
                <strong className="text-foreground">Pro</strong> — 50 crédits : 14,90 € TTC
              </li>
              <li>
                <strong className="text-foreground">Business</strong> — 150 crédits : 29,90 € TTC
              </li>
              <li>
                <strong className="text-foreground">Entreprise</strong> — 300 crédits : 49,90 € TTC
              </li>
            </ul>
            <p className="mt-2">
              Les prix sont indiqués en euros TTC. En tant que micro-entreprise non
              assujettie à la TVA (article 293 B du CGI), la TVA n&apos;est pas
              applicable.
            </p>
            <p className="mt-2">
              Les crédits achetés <strong className="text-foreground">n&apos;ont pas de date
              d&apos;expiration</strong> et restent disponibles tant que le compte
              utilisateur est actif.
            </p>
          </section>

          {/* Paiement */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              4. Paiement
            </h2>
            <p>
              Les paiements sont effectués en ligne via la plateforme sécurisée{" "}
              <strong className="text-foreground">Stripe</strong>. Les moyens de paiement
              acceptés incluent : carte bancaire (Visa, Mastercard, American Express).
            </p>
            <p className="mt-2">
              Les crédits sont ajoutés au compte de l&apos;utilisateur immédiatement
              après confirmation du paiement par Stripe.
            </p>
          </section>

          {/* Droit de rétractation */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              5. Droit de rétractation
            </h2>
            <p>
              Conformément à l&apos;article L221-28 du Code de la consommation, le
              droit de rétractation ne s&apos;applique pas aux contrats de fourniture
              de contenu numérique non fourni sur un support matériel dont
              l&apos;exécution a commencé avec l&apos;accord du consommateur.
            </p>
            <p className="mt-2">
              En achetant des crédits, l&apos;utilisateur accepte que le service soit
              exécuté immédiatement et renonce expressément à son droit de rétractation
              pour les crédits déjà utilisés.
            </p>
            <p className="mt-2">
              Pour les crédits non utilisés, un remboursement peut être demandé dans un
              délai de 14 jours suivant l&apos;achat en contactant le support à{" "}
              <a
                href="mailto:contact@guyon-informatique-web.fr"
                className="text-primary hover:underline"
              >
                contact@guyon-informatique-web.fr
              </a>
              .
            </p>
          </section>

          {/* Livraison */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              6. Livraison
            </h2>
            <p>
              Le service étant entièrement numérique, il n&apos;y a pas de livraison
              physique. Les crédits sont disponibles instantanément après paiement.
              Les fiches générées sont accessibles depuis le tableau de bord et
              exportables en PDF.
            </p>
          </section>

          {/* Utilisation acceptable */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              7. Utilisation acceptable
            </h2>
            <p>L&apos;utilisateur s&apos;engage à :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Ne pas utiliser le service à des fins illicites</li>
              <li>Ne pas uploader de contenu illégal, offensant ou contrefait</li>
              <li>
                Ne pas tenter de contourner les limitations du service (rate limiting,
                crédits)
              </li>
              <li>Ne pas revendre ou redistribuer le service sans autorisation</li>
            </ul>
            <p className="mt-2">
              Guyon Informatique &amp; Web se réserve le droit de suspendre ou
              supprimer un compte en cas de violation de ces conditions.
            </p>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              8. Limitation de responsabilité
            </h2>
            <p>
              Le contenu généré par l&apos;IA est fourni à titre indicatif.
              L&apos;utilisateur est seul responsable de la vérification, de la
              modification et de l&apos;utilisation du contenu produit.
            </p>
            <p className="mt-2">
              Guyon Informatique &amp; Web ne garantit pas la disponibilité continue
              du service et ne saurait être tenu responsable des interruptions
              temporaires liées à la maintenance ou à des dysfonctionnements techniques.
            </p>
          </section>

          {/* Résiliation */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              9. Résiliation
            </h2>
            <p>
              L&apos;utilisateur peut supprimer son compte à tout moment. Les crédits
              non utilisés ne sont pas remboursables en cas de résiliation volontaire
              au-delà du délai de rétractation de 14 jours.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              10. Droit applicable et litiges
            </h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige,
              l&apos;utilisateur peut recourir à un médiateur de la consommation
              conformément aux articles L611-1 et suivants du Code de la consommation.
            </p>
            <p className="mt-2">
              À défaut de résolution amiable, les tribunaux français seront
              compétents.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              11. Contact
            </h2>
            <p>
              Pour toute question relative aux présentes CGV, contactez-nous à :{" "}
              <a
                href="mailto:contact@guyon-informatique-web.fr"
                className="text-primary hover:underline"
              >
                contact@guyon-informatique-web.fr
              </a>
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
