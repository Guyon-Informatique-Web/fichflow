import type { Metadata } from "next"
import { getAuthUser } from "@/lib/auth"
import { BillingView } from "./billing-view"

export const metadata: Metadata = {
  title: "Abonnement",
}

export default async function AbonnementPage() {
  const user = await getAuthUser()

  return (
    <BillingView
      currentPlan={user.plan}
      hasSubscription={!!user.stripeSubscriptionId}
    />
  )
}
