import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

// Mettre à jour les champs personnalisés d'un produit
export async function PATCH(request: Request, { params }: Props) {
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

    // Vérifier que le produit appartient à l'utilisateur
    const product = await prisma.product.findUnique({
      where: { id, userId: user.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { customTitle, customDescription, customCharacteristics } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        customTitle: customTitle ?? undefined,
        customDescription: customDescription ?? undefined,
        customCharacteristics: customCharacteristics ?? undefined,
      },
    });

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Erreur mise à jour produit:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

// Supprimer un produit et ses photos associées
export async function DELETE(_request: Request, { params }: Props) {
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

    // Vérifier que le produit appartient à l'utilisateur
    const product = await prisma.product.findUnique({
      where: { id, userId: user.id },
      select: { id: true, photos: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 }
      );
    }

    // Supprimer les photos du Storage Supabase
    const photoPaths = (product.photos as string[])
      .map((url: string) => {
        const parts = url.split("/object/public/photos/");
        return parts[1] || "";
      })
      .filter(Boolean);

    if (photoPaths.length > 0) {
      await supabase.storage.from("photos").remove(photoPaths);
    }

    // Supprimer le produit (cascade sur les exports)
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
