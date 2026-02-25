// Utilitaire de synchronisation des paiements vers FactuPilot
// Appelle l'API /api/v1/sync/payment de FactuPilot après chaque paiement réussi
// Non-bloquant : en cas d'échec, enregistre dans SyncQueue pour retry CRON

import { prisma } from "@/lib/prisma"

const FACTUPILOT_SYNC_URL = process.env.FACTUPILOT_SYNC_URL || "https://factupilot-dun.vercel.app"
const SYNC_API_KEY = process.env.SYNC_API_KEY

interface SyncPaymentData {
  source: string
  client: {
    email: string
    name: string
  }
  payment: {
    amount: number
    description: string
    stripePaymentId: string
    type: "one_time" | "subscription"
    date: string
  }
}

/**
 * Tente la sync immédiate vers FactuPilot.
 * En cas d'échec, enregistre dans SyncQueue pour retry par le CRON.
 */
export async function syncPaymentToFactuPilot(data: SyncPaymentData): Promise<void> {
  if (!SYNC_API_KEY) {
    console.warn("SYNC_API_KEY non configuré — sync FactuPilot désactivée.")
    return
  }

  try {
    const response = await fetch(`${FACTUPILOT_SYNC_URL}/api/v1/sync/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sync-Key": SYNC_API_KEY,
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorBody}`)
    }

    const result = await response.json()
    console.log(`Sync FactuPilot réussie: ${result.invoiceNumber || result.message}`)
  } catch (error) {
    // Échec de la sync — enregistrer dans SyncQueue pour retry
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
    console.error("Échec sync FactuPilot, mise en queue:", errorMessage)

    try {
      await prisma.syncQueue.create({
        data: {
          payload: data as unknown as Record<string, unknown>,
          status: "PENDING",
          attempts: 1,
          lastAttemptAt: new Date(),
          errorMessage,
        },
      })
    } catch (queueError) {
      console.error("Impossible d'enregistrer dans SyncQueue:", queueError)
    }
  }
}
