import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { CREDIT_PACKS } from "@/lib/constants";
import { withErrorHandling } from "@/lib/api-error-handler";
import { prisma } from "@/lib/prisma";

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

    const body = await request.json();
    const { packId, plan, billing } = body;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // CAS 1 : Achat de crédits (pack)
    if (packId) {
      const pack = CREDIT_PACKS.find((p) => p.id === packId);
      if (!pack) {
        return NextResponse.json({ error: "Pack invalide." }, { status: 400 });
      }

      const priceId = process.env[pack.stripePriceEnv];
      if (!priceId) {
        return NextResponse.json(
          { error: "Configuration Stripe incomplète." },
          { status: 500 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          user_id: user.id,
          pack_id: pack.id,
          credits: pack.credits.toString(),
        },
        success_url: `${appUrl}/credits/succes?credits=${pack.credits}`,
        cancel_url: `${appUrl}/credits/annule`,
        customer_email: user.email!,
      });

      return NextResponse.json({ url: session.url });
    }

    // CAS 2 : Abonnement
    if (plan) {
      const { PLANS } = await import("@/config/plans");
      const planConfig = PLANS[plan as keyof typeof PLANS];
      if (!planConfig || planConfig.monthlyPrice === 0) {
        return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
      }

      const billingCycle = (billing as string) || "monthly";
      const priceId =
        billingCycle === "yearly"
          ? planConfig.stripePriceIds.yearly
          : planConfig.stripePriceIds.monthly;

      if (!priceId) {
        return NextResponse.json(
          { error: "Prix Stripe non configuré pour ce plan." },
          { status: 500 }
        );
      }

      // Récupérer l'utilisateur complet depuis Prisma
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });

      // Créer ou récupérer le customer Stripe
      let customerId = dbUser?.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email!,
          name: dbUser?.name || undefined,
          metadata: { userId: user.id },
        });
        customerId = customer.id;

        // Mettre à jour l'utilisateur avec le customer ID Stripe
        if (dbUser) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { stripeCustomerId: customerId },
          });
        } else {
          // Créer l'utilisateur s'il n'existe pas dans Prisma
          dbUser = await prisma.user.create({
            data: {
              id: user.id,
              email: user.email!,
              name: user.user_metadata?.name || null,
              stripeCustomerId: customerId,
            },
          });
        }
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: {
          metadata: { plan, user_id: user.id },
        },
        success_url: `${appUrl}/dashboard?upgrade=success`,
        cancel_url: `${appUrl}/abonnement?cancelled=true`,
      });

      return NextResponse.json({ url: session.url });
    }

    // CAS 3 : Ni packId ni plan fourni
    return NextResponse.json(
      { error: "Veuillez spécifier un plan ou un pack." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erreur Stripe checkout:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement." },
      { status: 500 }
    );
  }
}, "PAYMENT");
