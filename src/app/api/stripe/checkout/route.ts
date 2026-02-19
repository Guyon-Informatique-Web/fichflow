import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { CREDIT_PACKS } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { packId } = await request.json();

    // Trouver le pack demandé
    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack) {
      return NextResponse.json({ error: "Pack invalide." }, { status: 400 });
    }

    // Récupérer le price ID Stripe depuis les variables d'environnement
    const priceId = process.env[pack.stripePriceEnv];
    if (!priceId) {
      return NextResponse.json(
        { error: "Configuration Stripe incomplète." },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Créer la session Checkout
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
  } catch (error) {
    console.error("Erreur Stripe checkout:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement." },
      { status: 500 }
    );
  }
}
