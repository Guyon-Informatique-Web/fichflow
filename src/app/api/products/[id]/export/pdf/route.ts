import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { ProductPdf } from "@/components/pdf/ProductPdf";
import { withErrorHandling } from "@/lib/api-error-handler";

export const GET = withErrorHandling(async (_request, { params }) => {
  try {
    const { id } = await params;

    // Vérifier l'authentification
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    // Récupérer le produit
    const product = await prisma.product.findUnique({
      where: { id, userId: user.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 }
      );
    }

    // Préparer les données pour le PDF
    const title = product.customTitle || product.generatedTitle || product.name;
    const description =
      product.customDescription || product.generatedDescription || "";
    const characteristics =
      (product.customCharacteristics as Record<string, string>) ||
      (product.generatedCharacteristics as Record<string, string>) ||
      {};

    // Générer le PDF
    const buffer = await renderToBuffer(
      ProductPdf({
        name: product.name,
        title,
        description,
        characteristics,
        category: product.category,
        price: product.price ? Number(product.price) : null,
        photos: product.photos,
      })
    );

    // Enregistrer l'export
    await prisma.exportHistory.create({
      data: {
        productId: product.id,
        format: "PDF",
      },
    });

    // Retourner le PDF (convertir Buffer en Uint8Array pour NextResponse)
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${product.name.replace(/\s+/g, "-").toLowerCase()}-fiche.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur export PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF." },
      { status: 500 }
    );
  }
});
