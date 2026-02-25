// Configuration des plans d'abonnement FichFlow

export type PlanType = "FREE" | "ARTISAN" | "PRO"

export interface PlanLimits {
  maxPhotosPerProduct: number
  maxStoredProducts: number // 0 = illimité
  availableTones: string[] // Tons disponibles
  aiModel: string // Modèle IA utilisé
  canCustomBrand: boolean // Branding sur les PDFs
  canBulkGenerate: boolean // Génération en lot
  canMultiLang: boolean // Multi-langue (FR + EN)
  canExportText: boolean // Export texte brut
  monthlyCredits: number // Crédits inclus/mois (0 = aucun)
}

export interface PlanConfig {
  name: string
  description: string
  monthlyPrice: number // 0 pour gratuit
  yearlyPrice: number // 0 pour gratuit
  stripePriceIds: {
    monthly: string
    yearly: string
  }
  limits: PlanLimits
  features: string[] // Liste pour affichage marketing
}

export const PLANS: Record<PlanType, PlanConfig> = {
  FREE: {
    name: "Gratuit",
    description: "Pour découvrir FichFlow",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripePriceIds: { monthly: "", yearly: "" },
    limits: {
      maxPhotosPerProduct: 1,
      maxStoredProducts: 10,
      availableTones: ["PROFESSIONNEL", "DECONTRACTE", "PERSONNALISE"],
      aiModel: "claude-haiku-4-5-20251001",
      canCustomBrand: false,
      canBulkGenerate: false,
      canMultiLang: false,
      canExportText: false,
      monthlyCredits: 0,
    },
    features: [
      "3 crédits offerts",
      "1 photo par produit",
      "3 tons disponibles",
      "Export PDF standard",
      "10 fiches max",
    ],
  },
  ARTISAN: {
    name: "Artisan",
    description: "Pour les créateurs réguliers",
    monthlyPrice: 7.9,
    yearlyPrice: 75.9,
    stripePriceIds: {
      monthly: process.env.STRIPE_ARTISAN_MONTHLY_PRICE_ID || "",
      yearly: process.env.STRIPE_ARTISAN_YEARLY_PRICE_ID || "",
    },
    limits: {
      maxPhotosPerProduct: 3,
      maxStoredProducts: 0,
      availableTones: ["PROFESSIONNEL", "SENSUEL", "DECONTRACTE", "LUXE", "PERSONNALISE"],
      aiModel: "claude-haiku-4-5-20251001",
      canCustomBrand: true,
      canBulkGenerate: false,
      canMultiLang: false,
      canExportText: true,
      monthlyCredits: 20,
    },
    features: [
      "20 crédits/mois inclus",
      "3 photos par produit",
      "5 tons disponibles",
      "Export PDF + Texte",
      "Branding personnalisé",
      "Stockage illimité",
    ],
  },
  PRO: {
    name: "Pro",
    description: "Pour les professionnels exigeants",
    monthlyPrice: 14.9,
    yearlyPrice: 142.9,
    stripePriceIds: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    },
    limits: {
      maxPhotosPerProduct: 3,
      maxStoredProducts: 0,
      availableTones: ["PROFESSIONNEL", "SENSUEL", "DECONTRACTE", "LUXE", "PERSONNALISE"],
      aiModel: "claude-sonnet-4-6",
      canCustomBrand: true,
      canBulkGenerate: true,
      canMultiLang: true,
      canExportText: true,
      monthlyCredits: 50,
    },
    features: [
      "50 crédits/mois inclus",
      "IA Premium (Sonnet)",
      "3 photos par produit",
      "5 tons disponibles",
      "Export PDF + Texte",
      "Branding personnalisé",
      "Génération en lot",
      "Multi-langue (FR + EN)",
      "Support prioritaire",
      "Stockage illimité",
    ],
  },
}

/**
 * Récupérer les limites du plan
 */
export function getPlanLimits(plan: PlanType): PlanLimits {
  return PLANS[plan].limits
}

/**
 * Vérifier si un ton est disponible pour un plan
 */
export function isToneAvailable(plan: PlanType, tone: string): boolean {
  return PLANS[plan].limits.availableTones.includes(tone)
}
