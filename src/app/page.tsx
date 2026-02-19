import Link from "next/link";
import {
  Camera,
  Sparkles,
  FileText,
  Download,
  Clock,
  Zap,
  Palette,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CREDIT_PACKS } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            FichFlow
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#fonctionnalites" className="text-muted-foreground transition-colors hover:text-foreground">
              Fonctionnalités
            </a>
            <a href="#comment-ca-marche" className="text-muted-foreground transition-colors hover:text-foreground">
              Comment ça marche
            </a>
            <a href="#tarifs" className="text-muted-foreground transition-colors hover:text-foreground">
              Tarifs
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/connexion">Se connecter</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/inscription">Essai gratuit</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--color-primary)_0%,transparent_100%)] opacity-[0.03]" />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center md:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4" />
            Propulsé par l&apos;intelligence artificielle
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Créez vos fiches produit{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              en 30 secondes
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Uploadez une photo, l&apos;IA analyse votre produit et génère une fiche
            complète : titre optimisé, description engageante, caractéristiques
            détaillées et export PDF professionnel.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/inscription">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              3 fiches offertes — Sans carte bancaire
            </p>
          </div>
        </div>
      </section>

      {/* Workflow visuel : Comment ça marche */}
      <section id="comment-ca-marche" className="border-y bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              3 étapes, 30 secondes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              De la photo au PDF professionnel, sans effort
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                icon: Camera,
                title: "Uploadez une photo",
                description:
                  "Prenez votre produit en photo ou glissez-déposez une image existante. JPEG, PNG ou WebP acceptés.",
              },
              {
                step: "2",
                icon: Sparkles,
                title: "L'IA génère la fiche",
                description:
                  "Notre IA analyse la photo, identifie les caractéristiques et rédige une description engageante adaptée à votre ton.",
              },
              {
                step: "3",
                icon: Download,
                title: "Exportez en PDF",
                description:
                  "Personnalisez le résultat si besoin, puis exportez votre fiche produit en PDF professionnel, prête à l'emploi.",
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mb-2 text-sm font-medium text-muted-foreground">
                  Étape {step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Tout ce qu&apos;il faut pour vos fiches produit
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Plus qu&apos;un générateur de texte — un studio complet
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Camera,
                title: "Analyse photo intelligente",
                description:
                  "L'IA identifie les couleurs, matières, formes et détails de votre produit directement depuis la photo.",
              },
              {
                icon: FileText,
                title: "Description optimisée",
                description:
                  "Textes engageants et uniques, adaptés à votre cible. Pas de contenu générique copié-collé.",
              },
              {
                icon: Palette,
                title: "4 tons au choix",
                description:
                  "Professionnel, sensuel, décontracté ou luxe. Chaque description s'adapte à votre univers de marque.",
              },
              {
                icon: Zap,
                title: "Génération instantanée",
                description:
                  "Titre, description, caractéristiques techniques — tout est généré en quelques secondes.",
              },
              {
                icon: Download,
                title: "Export PDF professionnel",
                description:
                  "Téléchargez vos fiches en PDF prêt à imprimer ou à envoyer à vos clients et fournisseurs.",
              },
              {
                icon: Clock,
                title: "Édition en ligne",
                description:
                  "Modifiez chaque champ directement dans l'application. Ajustez le titre, la description ou les caractéristiques.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardContent className="p-6">
                  <Icon className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui ? */}
      <section className="border-y bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Conçu pour les indépendants
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Vous vendez des produits mais n&apos;avez pas le temps de rédiger des fiches ?
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Artisans & créateurs",
              "Boutiques indépendantes",
              "Vendeurs marketplace",
              "Micro-entrepreneurs",
            ].map((profile) => (
              <div
                key={profile}
                className="flex items-center gap-3 rounded-lg border bg-card p-4"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span className="font-medium">{profile}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Tarifs simples, sans abonnement
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Achetez des crédits, utilisez-les quand vous voulez. 1 crédit = 1 fiche complète.
            </p>
          </div>

          {/* Offre gratuite */}
          <div className="mb-10 rounded-xl border-2 border-primary bg-primary/5 p-6 text-center">
            <h3 className="text-xl font-bold">Essai gratuit</h3>
            <p className="mt-2 text-4xl font-bold">3 fiches offertes</p>
            <p className="mt-2 text-muted-foreground">
              Créez un compte et testez FichFlow immédiatement, sans carte bancaire.
            </p>
            <Button className="mt-6" size="lg" asChild>
              <Link href="/inscription">Commencer gratuitement</Link>
            </Button>
          </div>

          {/* Packs */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CREDIT_PACKS.map((pack, i) => (
              <Card
                key={pack.id}
                className={i === 1 ? "border-primary shadow-md" : ""}
              >
                <CardContent className="p-6 text-center">
                  {i === 1 && (
                    <div className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Populaire
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">{pack.name}</h3>
                  <p className="mt-3 text-4xl font-bold">{pack.credits}</p>
                  <p className="text-sm text-muted-foreground">crédits</p>
                  <p className="mt-4 text-3xl font-bold">{pack.price}€</p>
                  <p className="text-xs text-muted-foreground">
                    soit {(pack.price / pack.credits).toFixed(2)}€ / fiche
                  </p>
                  <Button
                    className="mt-6 w-full"
                    variant={i === 1 ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/inscription">Choisir</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Prêt à gagner du temps ?
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Rejoignez FichFlow et créez vos fiches produit professionnelles
            en quelques clics. 3 fiches offertes pour essayer.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 gap-2"
            asChild
          >
            <Link href="/inscription">
              Créer mon compte gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">FichFlow</span>
            <span>par</span>
            <a
              href="https://guyon-informatique-web.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-foreground"
            >
              Guyon Informatique &amp; Web
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
