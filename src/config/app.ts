// Configuration generale de l'application FichFlow

export const APP_CONFIG = {
  name: "FichFlow",
  tagline: "Vos fiches produit en 30 secondes",
  description:
    "Creez vos fiches produit professionnelles en 30 secondes grace a l'IA",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  email: {
    from: process.env.EMAIL_FROM || "noreply@fichflow.com",
    support: "support@fichflow.com",
  },
  company: {
    name: "Guyon Informatique & Web",
    status: "Micro-entreprise",
    email: "contact@guyoninformatique.fr",
    website: "https://guyon-informatique-web.fr",
  },
} as const
