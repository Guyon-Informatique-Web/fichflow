// Landing page marketing FichFlow
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Sparkles,
  FileText,
  Download,
  Pencil,
  Zap,
  ArrowRight,
  Star,
  Smartphone,
} from "lucide-react";
import { CREDIT_PACKS } from "@/lib/constants";
import { PLANS } from "@/config/plans";

// Tons disponibles
const TONES = [
  {
    name: "Professionnel",
    emoji: "💼",
    example: "Chaise ergonomique en chêne massif. Finitions soignées, confort optimal pour un usage quotidien prolongé.",
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "Décontracté",
    emoji: "😎",
    example: "Une chaise trop sympa qui va cartonner dans votre salon. Bois naturel, confort au top — on adore !",
    color: "border-green-500/30 bg-green-500/5",
    badge: "bg-green-500/10 text-green-400",
  },
  {
    name: "Sensuel",
    emoji: "✨",
    example: "La courbe parfaite du bois épouse vos formes. Une invitation au confort, une promesse de douceur.",
    color: "border-pink-500/30 bg-pink-500/5",
    badge: "bg-pink-500/10 text-pink-400",
  },
  {
    name: "Luxe",
    emoji: "👑",
    example: "Pièce d'exception en chêne massif sélectionné. Artisanat d'excellence pour les intérieurs les plus exigeants.",
    color: "border-yellow-500/30 bg-yellow-500/5",
    badge: "bg-yellow-500/10 text-yellow-400",
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
              href="#comment"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Comment ça marche
            </a>
            <a
              href="#tons"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Tons
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              FAQ
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
            Vos photos. Nos mots.{" "}
            <span className="text-primary">Des fiches produit qui vendent.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Uploadez une photo, obtenez une fiche produit professionnelle en 30 secondes.
            Export PDF inclus. 3 crédits offerts à l&apos;inscription, sans carte bancaire.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="text-base" asChild>
              <Link href="/inscription">
                Essayer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base" asChild>
              <a href="#comment">Voir comment ça marche</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            3 crédits offerts — Sans carte bancaire
          </p>
        </div>
        {/* Mockup carte produit */}
        <div className="mx-auto mt-16 max-w-2xl px-4">
          <div className="relative rounded-2xl border border-primary/30 bg-[#111827] p-6 shadow-[0_0_60px_rgba(0,210,150,0.08)] ring-1 ring-primary/10">
            {/* Badge IA */}
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">✓</span>
              <span className="text-xs font-semibold text-primary">Généré par FichFlow IA</span>
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Professionnel</span>
            </div>

            <div className="grid gap-5 sm:grid-cols-[130px_1fr]">
              {/* Photo produit */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop&auto=format"
                alt="Exemple sac en cuir"
                className="h-32 w-full rounded-xl object-cover sm:h-full"
              />

              {/* Contenu texte réel */}
              <div>
                <p className="text-sm font-bold text-white">Sac cabas en cuir grainé camel</p>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  Un sac intemporel alliant élégance et fonctionnalité. Sa matière en cuir grainé de qualité supérieure lui confère une texture subtile et une durabilité exceptionnelle.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    ["Matière", "Cuir grainé"],
                    ["Couleur", "Camel"],
                    ["Dimensions", "38 × 28 × 12 cm"],
                    ["Fermeture", "Zip + bouton pression"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline gap-1">
                      <span className="text-[10px] text-white/35">{k} :</span>
                      <span className="text-[10px] font-medium text-white/70">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer mockup */}
            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-[11px] text-white/40">1 crédit consommé</span>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:border-white/20">Modifier</button>
                <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Exporter PDF</button>
              </div>
            </div>
          </div>
        </div>

        {/* Blobs décoratifs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -top-20 right-1/4 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      <Separator />

      {/* Comment ça marche */}
      <section id="comment" className="scroll-mt-20 bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              3 étapes, c&apos;est tout.
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

      {/* Choix du ton */}
      <section id="tons" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Le bon ton pour votre marque
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choisissez le style qui correspond à votre univers
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TONES.map((tone) => (
              <div key={tone.name} className={`rounded-xl border p-5 ${tone.color}`}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl">{tone.emoji}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone.badge}`}>
                    {tone.name}
                  </span>
                </div>
                <p className="text-sm italic text-muted-foreground">
                  &ldquo;{tone.example}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Avantages */}
      <section id="avantages" className="scroll-mt-20 bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Pourquoi FichFlow ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Conçu pour les artisans, commerçants et e-commerçants
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Gain de temps massif</h3>
              <p className="text-muted-foreground">Ce qui prenait 30 minutes se fait en 30 secondes. Libérez-vous de la rédaction.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Pencil className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Qualité rédactionnelle</h3>
              <p className="text-muted-foreground">Des textes optimisés pour convaincre vos clients. Titre, description, caractéristiques — tout est pensé pour vendre.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">100% mobile</h3>
              <p className="text-muted-foreground">Créez vos fiches depuis n&apos;importe où, sur votre téléphone. Interface optimisée pour tous les écrans.</p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Tarifs */}
      <section id="tarifs" className="scroll-mt-20 py-20">
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

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Questions fréquentes</h2>
            <p className="mt-4 text-lg text-muted-foreground">Tout ce que vous devez savoir</p>
          </div>
          <div className="mt-12 space-y-4">
            {[
              { q: "C'est quoi un crédit ?", a: "1 crédit = 1 fiche produit générée. Vous consommez un crédit à chaque génération. Les crédits n'expirent jamais." },
              { q: "Quelles photos donnent les meilleurs résultats ?", a: "Des photos bien éclairées, fond neutre de préférence. Le produit doit être clairement visible. Vous pouvez uploader jusqu'à 3 photos pour enrichir la description." },
              { q: "Puis-je modifier la fiche générée ?", a: "Oui, chaque champ est entièrement modifiable dans l'application avant l'export. Vous pouvez ajuster le titre, la description, les caractéristiques et les attributs." },
              { q: "Quels formats d'export sont disponibles ?", a: "Export PDF professionnel disponible sur tous les plans. L'export texte brut (copier-coller direct) est disponible à partir du plan Artisan." },
              { q: "Je peux changer de plan à tout moment ?", a: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. La facturation est au mois, sans engagement." },
              { q: "Mes données et photos sont-elles conservées ?", a: "Vos fiches générées sont sauvegardées dans votre compte. Les photos uploadées sont utilisées uniquement pour la génération et ne sont pas revendues." },
            ].map(({ q, a }) => (
              <details key={q} className="group rounded-xl border bg-background p-5 open:border-primary/30">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {q}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
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
            Créez votre première fiche gratuitement
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            3 crédits offerts. Aucune carte bancaire requise.
          </p>
          <div className="mt-8">
            <Button size="lg" className="text-base" asChild>
              <Link href="/inscription">
                Commencer maintenant
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
