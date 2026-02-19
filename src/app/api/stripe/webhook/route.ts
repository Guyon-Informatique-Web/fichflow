import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

// Désactiver le body parser Next.js (Stripe a besoin du raw body)
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature manquante." },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET non configuré.");
    return NextResponse.json(
      { error: "Webhook non configuré." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Erreur vérification signature webhook:", err);
    return NextResponse.json(
      { error: "Signature invalide." },
      { status: 400 }
    );
  }

  // Traiter l'événement de paiement réussi
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const packId = session.metadata?.pack_id;
    const credits = parseInt(session.metadata?.credits || "0", 10);

    if (!userId || !credits) {
      console.error("Metadata manquante dans la session:", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      // Créditer l'utilisateur dans une transaction
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: credits } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId,
            type: "PURCHASE",
            amount: credits,
            description: `Achat pack ${packId} — ${credits} crédits`,
            stripeSessionId: session.id,
          },
        }),
      ]);

      console.log(
        `Crédits ajoutés: ${credits} pour l'utilisateur ${userId} (session ${session.id})`
      );
    } catch (error) {
      console.error("Erreur ajout crédits:", error);
      return NextResponse.json(
        { error: "Erreur interne." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
