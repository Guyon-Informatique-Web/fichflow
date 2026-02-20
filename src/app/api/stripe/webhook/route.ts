import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/api-error-handler";
import type Stripe from "stripe";

// Désactiver le body parser Next.js (Stripe a besoin du raw body)
export const dynamic = "force-dynamic";

export const POST = withErrorHandling(async (request) => {
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
      // Idempotence : vérifier que cette session n'a pas déjà été traitée
      const existing = await prisma.creditTransaction.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (existing) {
        console.log(`Session ${session.id} déjà traitée — ignorée.`);
        return NextResponse.json({ received: true });
      }

      // Créditer l'utilisateur dans une transaction atomique
      const [, , user] = await prisma.$transaction([
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
        prisma.user.findUniqueOrThrow({
          where: { id: userId },
          select: { email: true, name: true, credits: true },
        }),
      ]);

      // Envoyer l'email de confirmation d'achat
      try {
        const { resend } = await import("@/lib/resend");
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "FichFlow <noreply@fichflow.fr>",
          to: user.email,
          subject: `${credits} crédits ajoutés à votre compte FichFlow`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2>Merci pour votre achat !</h2>
              <p>Bonjour ${user.name || ""},</p>
              <p><strong>${credits} crédits</strong> ont été ajoutés à votre compte FichFlow.</p>
              <p>Votre solde actuel : <strong>${user.credits} crédits</strong></p>
              <p style="margin-top: 24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/produits/nouveau"
                   style="background: #171717; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
                  Créer une fiche produit
                </a>
              </p>
              <p style="margin-top: 32px; color: #888; font-size: 13px;">
                — L'équipe FichFlow
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        // Ne pas bloquer le webhook si l'email échoue
        console.error("Erreur envoi email confirmation achat:", emailError);
      }

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
}, "WEBHOOK");
