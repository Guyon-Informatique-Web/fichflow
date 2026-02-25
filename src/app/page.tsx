// Landing page marketing FichFlow
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Sparkles,
  FileText,
  Download,
  Pencil,
  Zap,
  Palette,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";
import { CREDIT_PACKS } from "@/lib/constants";
import { PLANS } from "@/config/plans";

// Fonctionnalités
const FEATURES = [
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
    icon: Pencil,
    title: "Édition en ligne",
    description:
      "Modifiez chaque champ directement dans l'application. Ajustez le titre, la description ou les caractéristiques.",
  },
];

// Témoignages
const TESTIMONIALS = [
  {
    name: "Marie L.",
    role: "Créatrice bijoux",
    text: "Je passais 45 minutes par fiche produit. Avec FichFlow, c'est fait en 30 secondes. La qualité est bluffante.",
  },
  {
    name: "Thomas R.",
    role: "Brocanteur",
    text: "Parfait pour mes objets vintage. L'IA décrit chaque pièce avec des détails que même moi je n'aurais pas notés.",
  },
  {
    name: "Sophie M.",
    role: "Savonnière artisanale",
    text: "Mes fiches produit sont maintenant aussi soignées que mes savons. Le PDF est superbe, mes clients adorent.",
  },
];

// Étapes du workflow
const STEPS = [
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
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FichFlow</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#fonctionnalites"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Fonctionnalités
            </a>
            <a
              href="#comment-ca-marche"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Comment ça marche
            </a>
            <a
              href="#tarifs"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Tarifs
            </a>
            <a
              href="#temoignages"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Témoignages
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/connexion">Connexion</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/inscription">
                Essai gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center md:py-32">
          <Badge variant="secondary" className="mb-6">
            Propulsé par l&apos;intelligence artificielle
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Créez vos fiches produit{" "}
            <span className="text-primary">en 30 secondes</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Uploadez une photo, l&apos;IA analyse votre produit et génère une
            fiche complète : titre optimisé, description engageante,
            caractéristiques détaillées et export PDF professionnel.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="text-base" asChild>
              <Link href="/inscription">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base" asChild>
              <a href="#fonctionnalites">Découvrir les fonctionnalités</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            3 fiches offertes — Sans carte bancaire
          </p>
        </div>
        {/* Blobs décoratifs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -top-20 right-1/4 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      <Separator />

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="scroll-mt-20 bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              3 étapes, 30 secondes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              De la photo au PDF professionnel, sans effort
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {STEPS.map(({ step, icon: Icon, title, description }) => (
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

      <Separator />

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Tout ce qu&apos;il faut pour vos fiches produit
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Plus qu&apos;un générateur de texte — un studio complet
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-none">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Tarifs */}
      <section id="tarifs" className="scroll-mt-20 bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Tarifs simples et transparents
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Commencez gratuitement, évoluez selon vos besoins
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {(["FREE", "ARTISAN", "PRO"] as const).map((planKey) => {
              const plan = PLANS[planKey]
              const isPopular = planKey === "PRO"
              return (
                <div
                  key={planKey}
                  className={`rounded-2xl border p-8 ${
                    isPopular ? "border-primary shadow-lg relative" : ""
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Recommandé
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    {plan.monthlyPrice === 0 ? (
                      <span className="text-4xl font-bold">0€</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">{plan.monthlyPrice}€</span>
                        <span className="text-muted-foreground">/mois</span>
                      </>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href={planKey === "FREE" ? "/inscription" : "/inscription"}
                      className={`block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                        isPopular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border hover:bg-muted"
                      }`}
                    >
                      {planKey === "FREE" ? "Commencer gratuitement" : "Essayer gratuitement"}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Packs de crédits */}
          <div className="mt-16 text-center">
            <h3 className="mb-2 text-xl font-bold">Besoin ponctuel ?</h3>
            <p className="mb-8 text-muted-foreground">
              Achetez des crédits sans abonnement
            </p>
            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-4">
              {CREDIT_PACKS.map((pack) => (
                <div key={pack.id} className="rounded-xl border p-4 text-center">
                  <p className="font-medium">{pack.name}</p>
                  <p className="text-2xl font-bold">{pack.credits}</p>
                  <p className="text-xs text-muted-foreground">crédits</p>
                  <p className="mt-2 text-lg font-bold">{pack.price}€</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Témoignages */}
      <section id="temoignages" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ils utilisent FichFlow
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Artisans, créateurs, commerçants... ils ont simplifié leurs fiches
              produit.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-sm italic text-muted-foreground">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* CTA final */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Prêt à gagner du temps ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Rejoignez FichFlow et créez vos fiches produit professionnelles en
            quelques clics. 3 fiches offertes pour essayer.
          </p>
          <div className="mt-8">
            <Button size="lg" className="text-base" asChild>
              <Link href="/inscription">
                Créer mon compte gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Marque */}
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-bold">FichFlow</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Créez vos fiches produit professionnelles en quelques clics
                grâce à l&apos;IA.
              </p>
            </div>
            {/* Produit */}
            <div>
              <h4 className="text-sm font-semibold">Produit</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#fonctionnalites"
                    className="hover:text-foreground"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="hover:text-foreground">
                    Tarifs
                  </a>
                </li>
                <li>
                  <Link href="/connexion" className="hover:text-foreground">
                    Connexion
                  </Link>
                </li>
              </ul>
            </div>
            {/* Légal */}
            <div>
              <h4 className="text-sm font-semibold">Légal</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/mentions-legales"
                    className="hover:text-foreground"
                  >
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/cgv" className="hover:text-foreground">
                    CGV
                  </Link>
                </li>
                <li>
                  <Link
                    href="/confidentialite"
                    className="hover:text-foreground"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold">Contact</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>contact@fichflow.fr</li>
                <li>
                  <a
                    href="https://guyon-informatique-web.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    Guyon Informatique &amp; Web
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Guyon Informatique &amp; Web. Tous
            droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
