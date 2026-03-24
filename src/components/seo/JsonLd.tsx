// JSON-LD Structured Data pour le SEO

export function WebApplicationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FichFlow",
    description:
      "Générateur de fiches produit par intelligence artificielle. Uploadez une photo, obtenez une fiche complète avec description, caractéristiques et export PDF.",
    url: "https://fichflow.fr",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        name: "Gratuit",
        price: "0",
        priceCurrency: "EUR",
        description: "3 crédits offerts, 1 photo par produit, export PDF",
      },
      {
        "@type": "Offer",
        name: "Artisan",
        price: "7.90",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          billingDuration: "P1M",
        },
        description: "20 crédits/mois, 3 photos, branding, export texte",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "14.90",
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          billingDuration: "P1M",
        },
        description: "50 crédits/mois, IA Premium, multi-langue, lot",
      },
    ],
    creator: {
      "@type": "Organization",
      name: "Guyon Informatique & Web",
      url: "https://guyon-informatique-web.fr",
    },
    featureList: [
      "Génération de fiches produit par IA",
      "Export PDF professionnel",
      "4 tons de rédaction",
      "Multi-langue FR/EN",
      "Branding personnalisé",
      "Génération en lot",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "C'est quoi un crédit FichFlow ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "1 crédit = 1 fiche produit générée par l'IA. Les crédits n'expirent jamais.",
        },
      },
      {
        "@type": "Question",
        name: "Quelles photos donnent les meilleurs résultats ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Des photos bien éclairées, fond neutre de préférence. Vous pouvez uploader jusqu'à 3 photos pour enrichir la description.",
        },
      },
      {
        "@type": "Question",
        name: "Quels formats d'export sont disponibles ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Export PDF professionnel sur tous les plans. Export texte brut à partir du plan Artisan.",
        },
      },
      {
        "@type": "Question",
        name: "Je peux changer de plan à tout moment ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, sans engagement. Passez à un plan supérieur ou inférieur quand vous voulez.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
