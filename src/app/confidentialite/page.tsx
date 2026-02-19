// Page politique de confidentialité — RGPD
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de confidentialité — FichFlow",
  description:
    "Politique de confidentialité et protection des données personnelles de FichFlow.",
};

export default function ConfidentialitePage() {
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
        <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
        <p className="mt-2 text-muted-foreground">
          Dernière mise à jour : 19 février 2026
        </p>

        <Separator className="my-8" />

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          {/* Introduction */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              1. Introduction
            </h2>
            <p>
              La présente politique de confidentialité décrit comment{" "}
              <strong className="text-foreground">Guyon Informatique &amp; Web</strong>{" "}
              collecte, utilise et protège vos données personnelles dans le cadre du
              service <strong className="text-foreground">FichFlow</strong>.
            </p>
            <p className="mt-2">
              Nous nous engageons à respecter le Règlement Général sur la Protection
              des Données (RGPD) et la loi Informatique et Libertés.
            </p>
          </section>

          {/* Responsable de traitement */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              2. Responsable du traitement
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Guyon Informatique &amp; Web</strong> —
                Micro-entreprise
              </li>
              <li>Responsable : Valentin Guyon</li>
              <li>
                Contact :{" "}
                <a
                  href="mailto:contact@guyon-informatique-web.fr"
                  className="text-primary hover:underline"
                >
                  contact@guyon-informatique-web.fr
                </a>
              </li>
            </ul>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              3. Données collectées
            </h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Données d&apos;inscription</strong> :
                adresse email, nom (optionnel), mot de passe (hashé)
              </li>
              <li>
                <strong className="text-foreground">Données d&apos;utilisation</strong> :
                photos uploadées, fiches produit créées, historique des exports
              </li>
              <li>
                <strong className="text-foreground">Données de paiement</strong> :
                traitées exclusivement par Stripe (nous ne stockons pas vos données
                bancaires)
              </li>
              <li>
                <strong className="text-foreground">Données techniques</strong> :
                cookies de session, logs de connexion
              </li>
            </ul>
          </section>

          {/* Finalité du traitement */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              4. Finalités du traitement
            </h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Créer et gérer votre compte utilisateur</li>
              <li>
                Fournir le service de génération de fiches produit (analyse IA des photos)
              </li>
              <li>Gérer les achats de crédits et le suivi des transactions</li>
              <li>Envoyer des emails transactionnels (confirmation d&apos;achat, bienvenue)</li>
              <li>Améliorer le service et corriger les bugs</li>
            </ul>
            <p className="mt-2">
              Vos données ne sont <strong className="text-foreground">jamais vendues</strong>{" "}
              à des tiers. Aucun email marketing n&apos;est envoyé sans consentement
              explicite.
            </p>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              5. Base légale du traitement
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Exécution du contrat</strong> : création
                de compte, génération de fiches, gestion des crédits
              </li>
              <li>
                <strong className="text-foreground">Intérêt légitime</strong> : amélioration
                du service, sécurité, prévention des abus
              </li>
              <li>
                <strong className="text-foreground">Obligation légale</strong> : conservation
                des données de facturation
              </li>
            </ul>
          </section>

          {/* Sous-traitants */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              6. Sous-traitants et transferts de données
            </h2>
            <p>
              Vos données peuvent être traitées par les sous-traitants suivants :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Supabase</strong> (Singapour / UE) :
                authentification et base de données — région eu-west (Paris)
              </li>
              <li>
                <strong className="text-foreground">Vercel</strong> (États-Unis) :
                hébergement de l&apos;application
              </li>
              <li>
                <strong className="text-foreground">Stripe</strong> (États-Unis) :
                traitement des paiements — certifié PCI DSS
              </li>
              <li>
                <strong className="text-foreground">Anthropic</strong> (États-Unis) :
                traitement IA des photos pour la génération de contenu
              </li>
              <li>
                <strong className="text-foreground">Resend</strong> (États-Unis) :
                envoi d&apos;emails transactionnels
              </li>
            </ul>
            <p className="mt-2">
              Ces sous-traitants sont soumis à des clauses contractuelles types (CCT)
              pour les transferts hors UE, conformément au RGPD.
            </p>
          </section>

          {/* Photos et IA */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              7. Photos et traitement par l&apos;IA
            </h2>
            <p>
              Les photos que vous uploadez sont stockées dans un espace privé
              (Supabase Storage) et envoyées à l&apos;API Anthropic pour analyse.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                Les photos ne sont <strong className="text-foreground">pas utilisées pour
                entraîner</strong> des modèles d&apos;IA
              </li>
              <li>
                Elles sont traitées uniquement pour générer la fiche produit demandée
              </li>
              <li>
                Vous pouvez supprimer vos photos et fiches à tout moment depuis votre
                tableau de bord
              </li>
            </ul>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              8. Durée de conservation
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Données de compte</strong> : conservées
                tant que le compte est actif, puis supprimées dans les 30 jours suivant
                la suppression du compte
              </li>
              <li>
                <strong className="text-foreground">Données de facturation</strong> :
                conservées 10 ans (obligation légale)
              </li>
              <li>
                <strong className="text-foreground">Photos et fiches</strong> : conservées
                tant que le compte est actif, supprimées avec le compte
              </li>
            </ul>
          </section>

          {/* Droits de l'utilisateur */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              9. Vos droits
            </h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">Droit d&apos;accès</strong> : obtenir
                une copie de vos données personnelles
              </li>
              <li>
                <strong className="text-foreground">Droit de rectification</strong> :
                corriger vos données depuis votre compte ou sur demande
              </li>
              <li>
                <strong className="text-foreground">Droit à l&apos;effacement</strong> :
                demander la suppression de vos données
              </li>
              <li>
                <strong className="text-foreground">Droit à la portabilité</strong> :
                recevoir vos données dans un format structuré
              </li>
              <li>
                <strong className="text-foreground">Droit d&apos;opposition</strong> :
                vous opposer au traitement de vos données
              </li>
              <li>
                <strong className="text-foreground">Droit à la limitation</strong> :
                demander la limitation du traitement
              </li>
            </ul>
            <p className="mt-2">
              Pour exercer vos droits, contactez-nous à{" "}
              <a
                href="mailto:contact@guyon-informatique-web.fr"
                className="text-primary hover:underline"
              >
                contact@guyon-informatique-web.fr
              </a>
              . Nous répondons dans un délai de 30 jours.
            </p>
            <p className="mt-2">
              Vous pouvez également adresser une réclamation à la{" "}
              <strong className="text-foreground">CNIL</strong> (Commission Nationale de
              l&apos;Informatique et des Libertés) :{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.cnil.fr
              </a>
            </p>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              10. Sécurité des données
            </h2>
            <p>
              Nous mettons en oeuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Chiffrement HTTPS pour toutes les communications</li>
              <li>Mots de passe hashés (jamais stockés en clair)</li>
              <li>Accès restreint aux données de production</li>
              <li>Headers de sécurité (HSTS, X-Frame-Options, CSP)</li>
              <li>Rate limiting sur les API sensibles</li>
            </ul>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              11. Modifications de cette politique
            </h2>
            <p>
              Cette politique peut être mise à jour pour refléter les évolutions du
              service ou de la réglementation. La date de dernière mise à jour est
              indiquée en haut de page. Nous vous recommandons de consulter cette page
              régulièrement.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              12. Contact
            </h2>
            <p>
              Pour toute question relative à la protection de vos données, contactez-nous
              à :{" "}
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
