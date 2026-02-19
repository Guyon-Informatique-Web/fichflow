// Constantes de l'application FichFlow

export const APP_NAME = "FichFlow";
export const APP_DESCRIPTION =
  "Créez vos fiches produit professionnelles en 30 secondes";

// Crédits offerts à l'inscription
export const FREE_CREDITS = 3;

// Packs de crédits (prix en euros)
export const CREDIT_PACKS = [
  {
    id: "pack_10",
    name: "Découverte",
    credits: 10,
    price: 4.9,
    stripePriceEnv: "STRIPE_PACK_10_PRICE_ID",
  },
  {
    id: "pack_50",
    name: "Standard",
    credits: 50,
    price: 14.9,
    stripePriceEnv: "STRIPE_PACK_50_PRICE_ID",
  },
  {
    id: "pack_150",
    name: "Pro",
    credits: 150,
    price: 29.9,
    stripePriceEnv: "STRIPE_PACK_150_PRICE_ID",
  },
  {
    id: "pack_300",
    name: "Business",
    credits: 300,
    price: 49.9,
    stripePriceEnv: "STRIPE_PACK_300_PRICE_ID",
  },
] as const;

// Tons disponibles pour la génération
export const TONES = [
  { value: "PROFESSIONNEL", label: "Professionnel", description: "Ton sobre et expert" },
  { value: "SENSUEL", label: "Sensuel", description: "Ton doux et séduisant" },
  { value: "DECONTRACTE", label: "Décontracté", description: "Ton léger et accessible" },
  { value: "LUXE", label: "Luxe", description: "Ton haut de gamme et raffiné" },
  { value: "PERSONNALISE", label: "Personnalisé", description: "Décrivez votre ton" },
] as const;

// Catégories prédéfinies (extensibles par l'utilisateur)
export const DEFAULT_CATEGORIES = [
  "Mode & Accessoires",
  "Beauté & Cosmétiques",
  "Maison & Décoration",
  "Électronique",
  "Alimentation",
  "Sport & Loisirs",
  "Bijoux & Montres",
  "Enfants & Bébés",
  "Artisanat",
  "Autre",
] as const;

// Placeholders adaptatifs par catégorie (nom et notes)
export const CATEGORY_PLACEHOLDERS: Record<
  string,
  { namePlaceholder: string; notesPlaceholder: string }
> = {
  "Mode & Accessoires": {
    namePlaceholder: "Ex : Robe en lin naturel",
    notesPlaceholder: "Matière, taille, coupe, public cible, style vestimentaire...",
  },
  "Beauté & Cosmétiques": {
    namePlaceholder: "Ex : Crème hydratante à l'aloe vera",
    notesPlaceholder: "Ingrédients clés, type de peau, contenance, bienfaits...",
  },
  "Maison & Décoration": {
    namePlaceholder: "Ex : Bougie parfumée en cire de soja",
    notesPlaceholder: "Dimensions, matériaux, style déco, pièce destinée...",
  },
  "Électronique": {
    namePlaceholder: "Ex : Enceinte Bluetooth portable",
    notesPlaceholder: "Caractéristiques techniques, autonomie, compatibilité...",
  },
  "Alimentation": {
    namePlaceholder: "Ex : Confiture artisanale aux fruits rouges",
    notesPlaceholder: "Ingrédients, poids, allergènes, mode de fabrication...",
  },
  "Sport & Loisirs": {
    namePlaceholder: "Ex : Tapis de yoga antidérapant",
    notesPlaceholder: "Dimensions, matière, niveau, activités compatibles...",
  },
  "Bijoux & Montres": {
    namePlaceholder: "Ex : Bracelet en argent 925 fait main",
    notesPlaceholder: "Matériau, taille, type de fermoir, pierre sertie...",
  },
  "Enfants & Bébés": {
    namePlaceholder: "Ex : Peluche en coton bio",
    notesPlaceholder: "Âge recommandé, matières, normes de sécurité, lavable...",
  },
  "Artisanat": {
    namePlaceholder: "Ex : Bol en céramique tourné à la main",
    notesPlaceholder: "Technique utilisée, dimensions, matériaux, usage...",
  },
  "Autre": {
    namePlaceholder: "Ex : Mon produit",
    notesPlaceholder: "Informations utiles pour la génération : matière, taille, public cible, mots-clés...",
  },
};

// Limites techniques
export const MAX_PHOTOS_PER_PRODUCT = 3;
export const MAX_PHOTO_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Modèle IA utilisé pour la génération
export const AI_MODEL = "claude-haiku-4-5-20251001" as const;
export const AI_MODEL_VISION = "claude-haiku-4-5-20251001" as const;
