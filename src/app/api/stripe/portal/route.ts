// Endpoint pour rediriger vers le portail Stripe Billing
// Permet à l'utilisateur de gérer son abonnement, changer de plan, annuler

import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { withErrorHandling } from "@/lib/api-error-handler"

export const POST = withErrorHandling(async () => {
  const supabase = await createClient()
  const { data: { user: supabaseUser } } = await supabase.auth.getUser()

  if (!supabaseUser) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
  })

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "Aucun abonnement Stripe trouvé." },
      { status: 400 }
    )
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/abonnement`,
  })

  return NextResponse.json({ url: session.url })
})
