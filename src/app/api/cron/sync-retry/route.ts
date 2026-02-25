// Endpoint CRON pour retenter les synchronisations échouées vers FactuPilot
// Exécuté quotidiennement à 6h par Vercel Cron

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withErrorHandling } from "@/lib/api-error-handler"

const FACTUPILOT_SYNC_URL = process.env.FACTUPILOT_SYNC_URL || "https://factupilot-dun.vercel.app"
const FACTUPILOT_APP_KEY = process.env.FACTUPILOT_APP_KEY
const MAX_ATTEMPTS = 5

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Vérifier le secret CRON
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  if (!FACTUPILOT_APP_KEY) {
    return NextResponse.json({ error: "FACTUPILOT_APP_KEY non configuré." }, { status: 500 })
  }

  // Récupérer les syncs en attente (PENDING ou FAILED avec < MAX_ATTEMPTS)
  const pendingSyncs = await prisma.syncQueue.findMany({
    where: {
      status: { in: ["PENDING", "FAILED"] },
      attempts: { lt: MAX_ATTEMPTS },
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  })

  if (pendingSyncs.length === 0) {
    return NextResponse.json({ message: "Aucune sync en attente.", processed: 0 })
  }

  let succeeded = 0
  let failed = 0
  const alerts: string[] = []

  for (const sync of pendingSyncs) {
    try {
      const response = await fetch(`${FACTUPILOT_SYNC_URL}/api/v1/sync/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${FACTUPILOT_APP_KEY}`,
        },
        body: JSON.stringify(sync.payload),
        signal: AbortSignal.timeout(15000),
      })

      if (response.ok) {
        await prisma.syncQueue.update({
          where: { id: sync.id },
          data: {
            status: "SYNCED",
            lastAttemptAt: new Date(),
            errorMessage: null,
          },
        })
        succeeded++
      } else {
        const errorBody = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorBody}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      const newAttempts = sync.attempts + 1

      await prisma.syncQueue.update({
        where: { id: sync.id },
        data: {
          status: "FAILED",
          attempts: newAttempts,
          lastAttemptAt: new Date(),
          errorMessage,
        },
      })

      failed++

      // Si max tentatives atteint, envoyer une alerte
      if (newAttempts >= MAX_ATTEMPTS) {
        alerts.push(`Sync ${sync.id} abandonnée après ${MAX_ATTEMPTS} tentatives: ${errorMessage}`)
      }
    }
  }

  // Envoyer les alertes email si nécessaire
  if (alerts.length > 0) {
    try {
      const { resend } = await import("@/lib/resend")
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "FichFlow <noreply@fichflow.fr>",
        to: "vguyon.dev@hotmail.com",
        subject: `[FichFlow] ${alerts.length} sync(s) FactuPilot échouée(s)`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Syncs FactuPilot en échec</h2>
            <p>${alerts.length} synchronisation(s) ont échoué après ${MAX_ATTEMPTS} tentatives :</p>
            <ul>
              ${alerts.map((a) => `<li style="margin-bottom: 8px;">${a}</li>`).join("")}
            </ul>
            <p style="color: #888; font-size: 13px; margin-top: 24px;">
              Intervention manuelle requise dans la base de données FichFlow (table sync_queue).
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Erreur envoi alerte sync:", emailError)
    }
  }

  return NextResponse.json({
    message: "Retry sync terminé.",
    processed: pendingSyncs.length,
    succeeded,
    failed,
    alerts: alerts.length,
  })
})
