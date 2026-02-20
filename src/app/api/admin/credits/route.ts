import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/api-error-handler";

// Ajouter des crédits bonus à un utilisateur (admin uniquement)
export const POST = withErrorHandling(async (request) => {
  try {
    // Vérifier l'authentification
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    // Vérifier le rôle admin
    const adminUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const { userId, amount } = await request.json();

    if (!userId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Paramètres invalides." },
        { status: 400 }
      );
    }

    // Transaction Prisma : incrémenter les crédits + créer la transaction
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: amount } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          type: "BONUS",
          amount,
          description: `Bonus admin (+${amount} crédits)`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      credits: updatedUser.credits,
    });
  } catch (error) {
    console.error("Erreur ajout crédits admin:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
});
