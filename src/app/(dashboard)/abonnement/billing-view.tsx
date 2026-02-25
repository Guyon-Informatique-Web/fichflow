"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Crown, Loader2, Sparkles, Zap } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PLANS, type PlanType } from "@/config/plans"

interface BillingViewProps {
  currentPlan: string
  hasSubscription: boolean
}

const PLAN_ICONS: Record<PlanType, React.ReactNode> = {
  FREE: <Zap className="h-5 w-5" />,
  ARTISAN: <Sparkles className="h-5 w-5" />,
  PRO: <Crown className="h-5 w-5" />,
}

const PLAN_ORDER: PlanType[] = ["FREE", "ARTISAN", "PRO"]

export function BillingView({ currentPlan, hasSubscription }: BillingViewProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [loadingPortal, setLoadingPortal] = useState(false)

  async function handleSubscribe(plan: PlanType) {
    setLoadingPlan(plan)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de la souscription.")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inattendue.")
      setLoadingPlan(null)
    }
  }

  async function handleManageSubscription() {
    setLoadingPortal(true)
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur.")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inattendue.")
      setLoadingPortal(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Abonnement</h1>
        <p className="text-muted-foreground">
          Choisissez le plan adapté à vos besoins
        </p>
      </div>

      {/* Toggle mensuel / annuel */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setBilling("monthly")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            billing === "monthly"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Mensuel
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            billing === "yearly"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Annuel
          <Badge variant="secondary" className="ml-2 text-xs">
            -20%
          </Badge>
        </button>
      </div>

      {/* Grille des plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLAN_ORDER.map((planKey) => {
          const plan = PLANS[planKey]
          const isCurrent = currentPlan === planKey
          const isPopular = planKey === "PRO"
          const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice
          const monthlyEquivalent = billing === "yearly" ? (plan.yearlyPrice / 12) : plan.monthlyPrice

          return (
            <Card
              key={planKey}
              className={`relative flex flex-col ${
                isPopular ? "border-primary shadow-lg" : ""
              } ${isCurrent ? "ring-2 ring-primary" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Recommandé
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {PLAN_ICONS[planKey]}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  {price === 0 ? (
                    <span className="text-3xl font-bold">Gratuit</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">
                        {monthlyEquivalent.toFixed(2).replace(".", ",")}€
                      </span>
                      <span className="text-muted-foreground">/mois</span>
                      {billing === "yearly" && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Facturé {price.toFixed(2).replace(".", ",")}€/an
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" disabled>
                      Plan actuel
                    </Button>
                    {hasSubscription && (
                      <Button
                        variant="ghost"
                        className="w-full text-sm"
                        onClick={handleManageSubscription}
                        disabled={loadingPortal}
                      >
                        {loadingPortal ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Gérer mon abonnement
                      </Button>
                    )}
                  </div>
                ) : planKey === "FREE" ? (
                  <Button variant="outline" className="w-full" disabled>
                    Plan de base
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(planKey)}
                    disabled={loadingPlan !== null}
                  >
                    {loadingPlan === planKey ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirection...
                      </>
                    ) : (
                      "S'abonner"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Lien vers les packs de crédits */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium">Besoin ponctuel ?</p>
            <p className="text-sm text-muted-foreground">
              Achetez des packs de crédits sans abonnement
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/credits">Voir les packs</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Gérer l'abonnement existant */}
      {hasSubscription && (
        <div className="text-center">
          <Button
            variant="link"
            onClick={handleManageSubscription}
            disabled={loadingPortal}
          >
            Modifier ou annuler mon abonnement via Stripe
          </Button>
        </div>
      )}
    </div>
  )
}
