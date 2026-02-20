import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/anthropic";
import {
  AI_MODEL,
  MAX_PHOTOS_PER_PRODUCT,
  MAX_PHOTO_SIZE_MB,
  ACCEPTED_IMAGE_TYPES,
} from "@/lib/constants";
import { withErrorHandling } from "@/lib/api-error-handler";
import type { Tone } from "@/generated/prisma/enums";

// Types pour la réponse IA structurée
interface GeneratedContent {
  title: string;
  description: string;
  characteristics: Record<string, string>;
  attributes: Record<string, string>;
}

export const POST = withErrorHandling(async (request) => {
  try {
    // Vérifier l'authentification
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    // Rate limiting : 10 requêtes par minute par utilisateur
    const { checkRateLimit } = await import("@/lib/rate-limit");
    const rateLimit = checkRateLimit(`generate:${supabaseUser.id}`, {
      maxRequests: 10,
      windowSeconds: 60,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessayez dans quelques instants." },
        { status: 429 }
      );
    }

    // Vérifier les crédits
    const user = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
    });

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { error: "Crédits insuffisants." },
        { status: 402 }
      );
    }

    // Parser le formulaire
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string | null;
    const notes = formData.get("notes") as string | null;
    const tone = (formData.get("tone") as string) || "PROFESSIONNEL";
    const photos = formData.getAll("photos") as File[];

    // Validation
    if (!name || !category) {
      return NextResponse.json(
        { error: "Nom et catégorie requis." },
        { status: 400 }
      );
    }

    if (photos.length === 0) {
      return NextResponse.json(
        { error: "Au moins une photo requise." },
        { status: 400 }
      );
    }

    if (photos.length > MAX_PHOTOS_PER_PRODUCT) {
      return NextResponse.json(
        { error: `Maximum ${MAX_PHOTOS_PER_PRODUCT} photos.` },
        { status: 400 }
      );
    }

    // Valider les fichiers
    for (const photo of photos) {
      if (!ACCEPTED_IMAGE_TYPES.includes(photo.type)) {
        return NextResponse.json(
          { error: "Format de photo non supporté. Utilisez JPEG, PNG ou WebP." },
          { status: 400 }
        );
      }
      if (photo.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `Photo trop volumineuse (max ${MAX_PHOTO_SIZE_MB} Mo).` },
          { status: 400 }
        );
      }
    }

    // Upload des photos vers Supabase Storage
    const photoUrls: string[] = [];
    for (const photo of photos) {
      const ext = photo.name.split(".").pop() || "jpg";
      const fileName = `${supabaseUser.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-photos")
        .upload(fileName, photo, {
          contentType: photo.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: "Erreur lors de l'upload de la photo." },
          { status: 500 }
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-photos").getPublicUrl(fileName);

      photoUrls.push(publicUrl);
    }

    // Préparer les images pour Claude Vision (base64)
    const imageContents = await Promise.all(
      photos.map(async (photo) => {
        const buffer = await photo.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mediaType = photo.type as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif";
        return {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: mediaType,
            data: base64,
          },
        };
      })
    );

    // Appel Claude Vision — génération de la fiche produit
    const toneLabels: Record<string, string> = {
      PROFESSIONNEL: "professionnel et sobre",
      SENSUEL: "sensuel et séduisant",
      DECONTRACTE: "décontracté et accessible",
      LUXE: "haut de gamme et luxueux",
      PERSONNALISE: "personnalisé",
    };

    const systemPrompt = `Tu es un expert en rédaction de fiches produit e-commerce.
Tu génères des fiches complètes, optimisées SEO, en français.
Tu réponds UNIQUEMENT en JSON valide, sans markdown ni texte avant/après.`;

    const userPrompt = `Analyse cette/ces photo(s) de produit et génère une fiche produit complète.

Informations fournies :
- Nom du produit : ${name}
- Catégorie : ${category}
${price ? `- Prix : ${price}€` : ""}
${notes ? `- Notes : ${notes}` : ""}
- Ton souhaité : ${toneLabels[tone] || "professionnel"}

Génère un JSON avec cette structure exacte :
{
  "title": "Titre optimisé SEO (60-80 caractères)",
  "description": "Description complète et engageante (150-300 mots). Utilise le ton demandé. Inclus les bénéfices, l'usage et les détails visuels observés sur la photo.",
  "characteristics": {
    "Matière": "...",
    "Couleur": "...",
    "Taille": "...",
    ...
  },
  "attributes": {
    "couleur_principale": "...",
    "matiere": "...",
    "style": "...",
    ...
  }
}

Règles :
- "characteristics" : 5 à 10 caractéristiques visibles et pertinentes pour un acheteur
- "attributes" : attributs techniques bruts extraits de la photo (couleurs, formes, textures)
- La description doit être unique, pas générique
- Adapte le vocabulaire au ton demandé
- N'invente pas de caractéristiques non visibles sur la photo`;

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            ...imageContents,
            { type: "text", text: userPrompt },
          ],
        },
      ],
    });

    // Extraire le JSON de la réponse
    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Réponse IA invalide." },
        { status: 500 }
      );
    }

    let generated: GeneratedContent;
    try {
      // Nettoyer le JSON (au cas où Claude ajoute du markdown)
      let jsonText = textBlock.text.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      generated = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: "Erreur de parsing de la réponse IA." },
        { status: 500 }
      );
    }

    // Créer le produit et débiter le crédit dans une transaction
    const [product] = await prisma.$transaction([
      prisma.product.create({
        data: {
          userId: user.id,
          name,
          category,
          price: price ? parseFloat(price) : null,
          notes: notes || null,
          tone: tone as Tone,
          photos: photoUrls,
          generatedTitle: generated.title,
          generatedDescription: generated.description,
          generatedCharacteristics: generated.characteristics,
          generatedAttributes: generated.attributes,
          status: "COMPLETED",
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: user.id,
          type: "CONSUMPTION",
          amount: -1,
          description: `Génération fiche : ${name}`,
        },
      }),
    ]);

    return NextResponse.json({ productId: product.id });
  } catch (error) {
    console.error("Erreur génération produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la fiche produit." },
      { status: 500 }
    );
  }
});
