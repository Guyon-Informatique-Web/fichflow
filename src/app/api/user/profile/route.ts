import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/api-error-handler";

// Mettre à jour le profil utilisateur (nom)
export const PATCH = withErrorHandling(async (request) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { name } = await request.json();

    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom est requis." },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Mettre à jour dans Prisma
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: trimmedName },
    });

    // Mettre à jour les metadata Supabase
    await supabase.auth.updateUser({
      data: { name: trimmedName },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
});
