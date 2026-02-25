# FichFlow — Monétisation hybride + Sync FactuPilot

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transformer FichFlow d'un modèle 100% packs crédits vers un modèle hybride abonnements + packs, et synchroniser chaque paiement vers FactuPilot pour centraliser la comptabilité.

**Architecture:** Deux chantiers indépendants. Chantier 1 : API sync dans FactuPilot + utilitaire sync dans FichFlow + CRON retry. Chantier 2 : ajout plans d'abonnement (GRATUIT/ARTISAN/PRO) avec feature gating, branding custom, et modèle IA tiered (Haiku/Sonnet).

**Tech Stack:** Next.js 16, React 19, Prisma 7, Stripe (subscriptions + one-time), Supabase, Tailwind v4, Claude Haiku 4.5 / Sonnet 4.6

---

## CHANTIER 1 : Sync post-paiement vers FactuPilot

### Task 1 : Schema FactuPilot — ajouter champs source

**Files:**
- Modify: `factupilot/prisma/schema.prisma` (modèles Client et Invoice)

**Step 1: Ajouter le champ `source` au modèle Client**

Dans `factupilot/prisma/schema.prisma`, ajouter après le champ `notes` du modèle Client :

```prisma
  source    String?  // Source SaaS (fichflow, vigieweb, null = client direct)
```

**Step 2: Ajouter les champs `source` et `externalPaymentId` au modèle Invoice**

Dans le modèle Invoice, ajouter après le champ `facturxXml` :

```prisma
  // Sync inter-SaaS
  source             String?  // Source SaaS (fichflow, vigieweb, null = facture manuelle)
  externalPaymentId  String?  @unique @map("external_payment_id") // ID Stripe du SaaS source (idempotence)
```

**Step 3: Générer et appliquer la migration**

```bash
cd factupilot
npx prisma migrate dev --name add-saas-source-fields
```

Expected: Migration créée, schéma appliqué sans erreur.

**Step 4: Commit**

```bash
cd factupilot
git add prisma/
git commit -m "feat: ajouter champs source et externalPaymentId pour sync inter-SaaS"
```

---

### Task 2 : API FactuPilot — endpoint sync/payment

**Files:**
- Create: `factupilot/src/app/api/v1/sync/payment/route.ts`

**Step 1: Créer l'endpoint POST /api/v1/sync/payment**

```typescript
// Endpoint de synchronisation inter-SaaS
// Reçoit les paiements des autres SaaS et crée client + facture dans FactuPilot
// Auth : header X-Sync-Key (clé partagée, pas une API key utilisateur)

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withErrorHandling } from "@/lib/api-error-handler"

// Sources SaaS autorisées
const VALID_SOURCES = ["fichflow", "vigieweb", "autodiffuze"] as const
type SaasSource = typeof VALID_SOURCES[number]

interface SyncPaymentBody {
  source: SaasSource
  client: {
    email: string
    name: string
  }
  payment: {
    amount: number // en euros (ex: 14.90)
    description: string
    stripePaymentId: string // ID Stripe du SaaS source
    type: "one_time" | "subscription"
    date: string // ISO 8601
  }
}

export const POST = withErrorHandling(async (request: NextRequest) => {
  // Vérifier la clé de sync
  const syncKey = request.headers.get("x-sync-key")
  if (!syncKey || syncKey !== process.env.SYNC_API_KEY) {
    return NextResponse.json(
      { error: "Clé de synchronisation invalide." },
      { status: 401 }
    )
  }

  const body: SyncPaymentBody = await request.json()

  // Validation
  if (!body.source || !VALID_SOURCES.includes(body.source)) {
    return NextResponse.json(
      { error: `Source invalide. Valeurs acceptées : ${VALID_SOURCES.join(", ")}` },
      { status: 400 }
    )
  }

  if (!body.client?.email || !body.client?.name) {
    return NextResponse.json(
      { error: "Client email et name requis." },
      { status: 400 }
    )
  }

  if (!body.payment?.amount || !body.payment?.stripePaymentId || !body.payment?.description) {
    return NextResponse.json(
      { error: "Payment amount, stripePaymentId et description requis." },
      { status: 400 }
    )
  }

  // Idempotence : vérifier que ce paiement n'a pas déjà été synchronisé
  const existingInvoice = await prisma.invoice.findUnique({
    where: { externalPaymentId: body.payment.stripePaymentId },
  })

  if (existingInvoice) {
    return NextResponse.json({
      message: "Paiement déjà synchronisé.",
      invoiceId: existingInvoice.id,
      duplicate: true,
    })
  }

  // Récupérer la company admin (Guyon Informatique & Web)
  // C'est la company du compte admin qui centralise toutes les factures SaaS
  const adminUser = await prisma.user.findFirst({
    where: { isAdmin: true },
    include: { company: true },
  })

  if (!adminUser?.company) {
    return NextResponse.json(
      { error: "Aucune company admin configurée dans FactuPilot." },
      { status: 500 }
    )
  }

  const company = adminUser.company

  // Créer ou mettre à jour le client
  let client = await prisma.client.findFirst({
    where: {
      companyId: company.id,
      email: body.client.email,
    },
  })

  if (!client) {
    client = await prisma.client.create({
      data: {
        companyId: company.id,
        name: body.client.name,
        email: body.client.email,
        source: body.source,
      },
    })
  } else if (!client.source) {
    // Si le client existait sans source, ajouter la source
    await prisma.client.update({
      where: { id: client.id },
      data: { source: body.source },
    })
  }

  // Générer le numéro de facture
  const year = new Date().getFullYear()
  const prefix = company.invoicePrefix
  const nextNum = company.nextInvoiceNum
  const invoiceNumber = `${prefix}-${year}-${String(nextNum).padStart(4, "0")}`

  // Montant en Decimal
  const amount = body.payment.amount

  // Créer la facture payée + incrémenter le compteur
  const [invoice] = await prisma.$transaction([
    prisma.invoice.create({
      data: {
        companyId: company.id,
        clientId: client.id,
        number: invoiceNumber,
        status: "PAID",
        date: new Date(body.payment.date),
        dueDate: new Date(body.payment.date),
        subject: `[${body.source.toUpperCase()}] ${body.payment.description}`,
        totalHt: amount,
        totalVat: 0, // Micro-entrepreneur : TVA non applicable
        totalTtc: amount,
        paidAt: new Date(body.payment.date),
        paidAmount: amount,
        paymentMethod: "carte",
        source: body.source,
        externalPaymentId: body.payment.stripePaymentId,
        items: {
          create: {
            description: body.payment.description,
            quantity: 1,
            unitPriceHt: amount,
            totalHt: amount,
            vatRate: 0,
            position: 0,
          },
        },
      },
    }),
    prisma.company.update({
      where: { id: company.id },
      data: { nextInvoiceNum: { increment: 1 } },
    }),
  ])

  return NextResponse.json({
    message: "Paiement synchronisé avec succès.",
    invoiceId: invoice.id,
    invoiceNumber,
    clientId: client.id,
    duplicate: false,
  })
}, "SYNC")
```

**Step 2: Ajouter `SYNC_API_KEY` au fichier env**

Dans `SaaS/.env.local`, ajouter :

```
SYNC_API_KEY=sync_<générer une clé aléatoire de 64 caractères>
```

Dans `SaaS/.env` (template), ajouter :

```
# Clé de synchronisation inter-SaaS (partagée entre tous les projets)
SYNC_API_KEY=
```

Note : cette variable n'a PAS de préfixe projet car elle est partagée par tous les SaaS.

**Step 3: Vérifier que la variable est chargée**

Dans `factupilot/src/lib/load-common-env.ts`, s'assurer que `SYNC_API_KEY` (sans préfixe) est bien chargé. Elle devrait l'être automatiquement car les variables sans préfixe sont partagées.

**Step 4: Commit**

```bash
cd factupilot
git add src/app/api/v1/sync/
git commit -m "feat: endpoint POST /api/v1/sync/payment pour centralisation inter-SaaS"
```

---

### Task 3 : Dashboard FactuPilot — filtre par source et widget revenus SaaS

**Files:**
- Modify: `factupilot/src/app/dashboard/page.tsx` (ajouter widget revenus par source)
- Modify: `factupilot/src/app/dashboard/invoices/page.tsx` (ajouter filtre source)
- Modify: `factupilot/src/app/dashboard/clients/page.tsx` (ajouter filtre source)
- Modify: `factupilot/src/components/dashboard/InvoiceList.tsx` (badge source)
- Modify: `factupilot/src/components/dashboard/ClientList.tsx` (badge source)

**Step 1: Ajouter un badge source aux listes factures et clients**

Dans `InvoiceList.tsx`, ajouter un badge coloré quand `invoice.source` est non-null :

```tsx
// Badge source SaaS
const SOURCE_COLORS: Record<string, string> = {
  fichflow: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  vigieweb: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  autodiffuze: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

// Dans le JSX de chaque ligne, après le numéro de facture :
{invoice.source && (
  <Badge className={SOURCE_COLORS[invoice.source] || "bg-gray-100"}>
    {invoice.source}
  </Badge>
)}
```

Même pattern dans `ClientList.tsx` pour le badge client.

**Step 2: Ajouter un filtre source dans les listes**

Ajouter un `<Select>` avec les options "Tous", "Direct", "FichFlow", "VigieWeb", "Autodiffuze" qui filtre les résultats.

**Step 3: Ajouter un widget "Revenus par SaaS" sur le dashboard**

Dans `factupilot/src/app/dashboard/page.tsx`, ajouter une requête agrégée :

```typescript
// Revenus par source SaaS (mois en cours)
const revenueBySource = await prisma.invoice.groupBy({
  by: ["source"],
  where: {
    companyId: company.id,
    status: "PAID",
    paidAt: { gte: startOfMonth, lte: endOfMonth },
  },
  _sum: { totalTtc: true },
})
```

Afficher dans un petit tableau ou des KpiCards dédiées.

**Step 4: Commit**

```bash
cd factupilot
git add src/app/dashboard/ src/components/dashboard/
git commit -m "feat: dashboard avec filtre source SaaS et widget revenus inter-SaaS"
```

---

### Task 4 : FichFlow — modèle SyncQueue

**Files:**
- Modify: `fichflow/prisma/schema.prisma`

**Step 1: Ajouter le modèle SyncQueue et l'enum SyncStatus**

Après le modèle ExportHistory dans `fichflow/prisma/schema.prisma` :

```prisma
// ============================================
// SYNC FACTUPILOT
// ============================================

model SyncQueue {
  id           String     @id @default(uuid())
  payload      Json       // Données client + payment à envoyer
  status       SyncStatus @default(PENDING)
  attempts     Int        @default(0)
  lastAttemptAt DateTime? @map("last_attempt_at")
  errorMessage String?    @map("error_message")
  createdAt    DateTime   @default(now()) @map("created_at")

  @@index([status])
  @@map("sync_queue")
}

enum SyncStatus {
  PENDING
  FAILED
  SYNCED
}
```

**Step 2: Générer et appliquer la migration**

```bash
cd fichflow
npx prisma migrate dev --name add-sync-queue
```

**Step 3: Commit**

```bash
cd fichflow
git add prisma/
git commit -m "feat: modèle SyncQueue pour sync asynchrone vers FactuPilot"
```

---

### Task 5 : FichFlow — utilitaire factupilot-sync.ts

**Files:**
- Create: `fichflow/src/lib/factupilot-sync.ts`

**Step 1: Créer l'utilitaire de sync**

```typescript
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
      signal: AbortSignal.timeout(10000), // Timeout 10 secondes
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
      // Si même l'écriture en queue échoue, on log et on continue
      console.error("Impossible d'enregistrer dans SyncQueue:", queueError)
    }
  }
}
```

**Step 2: Ajouter les variables d'env**

Dans `SaaS/.env` (template), ajouter :

```
# URL de sync FactuPilot (pour les autres SaaS)
FACTUPILOT_SYNC_URL=https://factupilot-dun.vercel.app
```

Dans `SaaS/.env.local`, ajouter :

```
FACTUPILOT_SYNC_URL=https://factupilot-dun.vercel.app
```

Note : `SYNC_API_KEY` est déjà ajouté en Task 2.

**Step 3: Commit**

```bash
cd fichflow
git add src/lib/factupilot-sync.ts
git commit -m "feat: utilitaire sync paiements vers FactuPilot avec fallback SyncQueue"
```

---

### Task 6 : FichFlow — intégrer la sync dans le webhook Stripe

**Files:**
- Modify: `fichflow/src/app/api/stripe/webhook/route.ts`

**Step 1: Ajouter l'appel sync après le traitement du paiement**

Après le bloc `console.log("Crédits ajoutés...")` et avant le `return NextResponse.json({ received: true })` final, ajouter :

```typescript
      // Sync vers FactuPilot (non-bloquant)
      const { syncPaymentToFactuPilot } = await import("@/lib/factupilot-sync")
      const pack = CREDIT_PACKS.find((p) => p.id === packId)
      syncPaymentToFactuPilot({
        source: "fichflow",
        client: {
          email: user.email,
          name: user.name || user.email,
        },
        payment: {
          amount: pack?.price || 0,
          description: `Pack ${pack?.name || packId} — ${credits} crédits`,
          stripePaymentId: session.id,
          type: "one_time",
          date: new Date().toISOString(),
        },
      }).catch((err) => {
        // Ne jamais bloquer le webhook pour la sync
        console.error("Erreur sync FactuPilot (non-bloquant):", err)
      })
```

Ajouter l'import en haut du fichier :

```typescript
import { CREDIT_PACKS } from "@/lib/constants"
```

**Step 2: Commit**

```bash
cd fichflow
git add src/app/api/stripe/webhook/route.ts
git commit -m "feat: sync automatique des paiements vers FactuPilot dans le webhook"
```

---

### Task 7 : FichFlow — CRON retry des syncs échouées

**Files:**
- Create: `fichflow/src/app/api/cron/sync-retry/route.ts`
- Create: `fichflow/vercel.json`

**Step 1: Créer l'endpoint CRON**

```typescript
// Endpoint CRON pour retenter les synchronisations échouées vers FactuPilot
// Exécuté quotidiennement à 6h par Vercel Cron

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withErrorHandling } from "@/lib/api-error-handler"

const FACTUPILOT_SYNC_URL = process.env.FACTUPILOT_SYNC_URL || "https://factupilot-dun.vercel.app"
const SYNC_API_KEY = process.env.SYNC_API_KEY
const MAX_ATTEMPTS = 5

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Vérifier le secret CRON
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
  }

  if (!SYNC_API_KEY) {
    return NextResponse.json({ error: "SYNC_API_KEY non configuré." }, { status: 500 })
  }

  // Récupérer les syncs en attente (PENDING ou FAILED avec < MAX_ATTEMPTS)
  const pendingSyncs = await prisma.syncQueue.findMany({
    where: {
      status: { in: ["PENDING", "FAILED"] },
      attempts: { lt: MAX_ATTEMPTS },
    },
    orderBy: { createdAt: "asc" },
    take: 50, // Traiter par lots de 50
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
          "X-Sync-Key": SYNC_API_KEY,
        },
        body: JSON.stringify(sync.payload),
        signal: AbortSignal.timeout(15000),
      })

      if (response.ok) {
        // Succès — marquer comme synced
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
```

**Step 2: Créer le fichier vercel.json**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "npm install --ignore-scripts && npx prisma generate",
  "crons": [
    {
      "path": "/api/cron/sync-retry",
      "schedule": "0 6 * * *"
    }
  ]
}
```

**Step 3: Ajouter CRON_SECRET au fichier env**

Dans `SaaS/.env.local`, ajouter :

```
FICHFLOW_CRON_SECRET=cron_<générer une clé aléatoire de 32 caractères>
```

Dans `SaaS/.env` (template) :

```
FICHFLOW_CRON_SECRET=
```

**Step 4: Commit**

```bash
cd fichflow
git add src/app/api/cron/ vercel.json
git commit -m "feat: CRON quotidien retry sync FactuPilot avec alerte email après 5 échecs"
```

---

## CHANTIER 2 : Monétisation hybride FichFlow

### Task 8 : Schema FichFlow — plans, abonnements, branding

**Files:**
- Modify: `fichflow/prisma/schema.prisma`

**Step 1: Ajouter l'enum Plan**

Après l'enum `ExportFormat` :

```prisma
enum Plan {
  FREE
  ARTISAN
  PRO
}
```

**Step 2: Modifier le modèle User**

Ajouter les champs abonnement et plan :

```prisma
model User {
  id                   String   @id @default(uuid())
  email                String   @unique
  name                 String?
  role                 Role     @default(USER)
  credits              Int      @default(0)
  plan                 Plan     @default(FREE)
  stripeCustomerId     String?  @unique @map("stripe_customer_id")
  stripeSubscriptionId String?  @unique @map("stripe_subscription_id")
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  products           Product[]
  creditTransactions CreditTransaction[]
  company            Company?

  @@map("users")
}
```

**Step 3: Ajouter le modèle Company (branding)**

Après le modèle User :

```prisma
// ============================================
// ENTREPRISE (branding custom pour abonnés)
// ============================================

model Company {
  id           String  @id @default(uuid())
  userId       String  @unique @map("user_id")
  name         String  // Nom commercial
  logoUrl      String? @map("logo_url") // URL logo dans Supabase Storage
  primaryColor String? @map("primary_color") // Couleur principale (#hex)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("companies")
}
```

**Step 4: Générer et appliquer la migration**

```bash
cd fichflow
npx prisma migrate dev --name add-plans-company-branding
```

**Step 5: Commit**

```bash
cd fichflow
git add prisma/
git commit -m "feat: schema plans (FREE/ARTISAN/PRO), abonnements Stripe, branding Company"
```

---

### Task 9 : FichFlow — configuration des plans et limites

**Files:**
- Create: `fichflow/src/config/plans.ts`
- Modify: `fichflow/src/lib/constants.ts` (ajouter constantes plans)

**Step 1: Créer la configuration des plans**

```typescript
// Configuration des plans d'abonnement FichFlow

export type PlanType = "FREE" | "ARTISAN" | "PRO"

export interface PlanLimits {
  maxPhotosPerProduct: number
  maxStoredProducts: number // 0 = illimité
  availableTones: string[] // Tons disponibles
  aiModel: string // Modèle IA utilisé
  canCustomBrand: boolean // Branding sur les PDFs
  canBulkGenerate: boolean // Génération en lot
  canMultiLang: boolean // Multi-langue (FR + EN)
  canExportText: boolean // Export texte brut
  monthlyCredits: number // Crédits inclus/mois (0 = aucun)
}

export interface PlanConfig {
  name: string
  description: string
  monthlyPrice: number // 0 pour gratuit
  yearlyPrice: number // 0 pour gratuit
  stripePriceIds: {
    monthly: string
    yearly: string
  }
  limits: PlanLimits
  features: string[] // Liste pour affichage marketing
}

export const PLANS: Record<PlanType, PlanConfig> = {
  FREE: {
    name: "Gratuit",
    description: "Pour découvrir FichFlow",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripePriceIds: { monthly: "", yearly: "" },
    limits: {
      maxPhotosPerProduct: 1,
      maxStoredProducts: 10,
      availableTones: ["PROFESSIONNEL", "DECONTRACTE", "PERSONNALISE"],
      aiModel: "claude-haiku-4-5-20251001",
      canCustomBrand: false,
      canBulkGenerate: false,
      canMultiLang: false,
      canExportText: false,
      monthlyCredits: 0,
    },
    features: [
      "3 crédits offerts",
      "1 photo par produit",
      "3 tons disponibles",
      "Export PDF standard",
      "10 fiches max",
    ],
  },
  ARTISAN: {
    name: "Artisan",
    description: "Pour les créateurs réguliers",
    monthlyPrice: 7.9,
    yearlyPrice: 75.9,
    stripePriceIds: {
      monthly: process.env.STRIPE_ARTISAN_MONTHLY_PRICE_ID || "",
      yearly: process.env.STRIPE_ARTISAN_YEARLY_PRICE_ID || "",
    },
    limits: {
      maxPhotosPerProduct: 3,
      maxStoredProducts: 0, // Illimité
      availableTones: ["PROFESSIONNEL", "SENSUEL", "DECONTRACTE", "LUXE", "PERSONNALISE"],
      aiModel: "claude-haiku-4-5-20251001",
      canCustomBrand: true,
      canBulkGenerate: false,
      canMultiLang: false,
      canExportText: true,
      monthlyCredits: 20,
    },
    features: [
      "20 crédits/mois inclus",
      "3 photos par produit",
      "5 tons disponibles",
      "Export PDF + Texte",
      "Branding personnalisé",
      "Stockage illimité",
    ],
  },
  PRO: {
    name: "Pro",
    description: "Pour les professionnels exigeants",
    monthlyPrice: 14.9,
    yearlyPrice: 142.9,
    stripePriceIds: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    },
    limits: {
      maxPhotosPerProduct: 3,
      maxStoredProducts: 0, // Illimité
      availableTones: ["PROFESSIONNEL", "SENSUEL", "DECONTRACTE", "LUXE", "PERSONNALISE"],
      aiModel: "claude-sonnet-4-6",
      canCustomBrand: true,
      canBulkGenerate: true,
      canMultiLang: true,
      canExportText: true,
      monthlyCredits: 50,
    },
    features: [
      "50 crédits/mois inclus",
      "IA Premium (Sonnet)",
      "3 photos par produit",
      "5 tons disponibles",
      "Export PDF + Texte",
      "Branding personnalisé",
      "Génération en lot",
      "Multi-langue (FR + EN)",
      "Support prioritaire",
      "Stockage illimité",
    ],
  },
}

/**
 * Récupérer les limites du plan
 */
export function getPlanLimits(plan: PlanType): PlanLimits {
  return PLANS[plan].limits
}

/**
 * Vérifier si un ton est disponible pour un plan
 */
export function isToneAvailable(plan: PlanType, tone: string): boolean {
  return PLANS[plan].limits.availableTones.includes(tone)
}
```

**Step 2: Mettre à jour constants.ts**

Ajouter les constantes pour les modèles IA premium :

```typescript
// Modèles IA par plan
export const AI_MODEL = "claude-haiku-4-5-20251001" as const
export const AI_MODEL_PREMIUM = "claude-sonnet-4-6" as const
```

Remplacer `AI_MODEL_VISION` par `AI_MODEL_PREMIUM` (ou le garder comme alias si déjà utilisé ailleurs).

**Step 3: Ajouter les variables d'env Stripe**

Dans `SaaS/.env` (template) :

```
FICHFLOW_STRIPE_ARTISAN_MONTHLY_PRICE_ID=
FICHFLOW_STRIPE_ARTISAN_YEARLY_PRICE_ID=
FICHFLOW_STRIPE_PRO_MONTHLY_PRICE_ID=
FICHFLOW_STRIPE_PRO_YEARLY_PRICE_ID=
```

**Step 4: Commit**

```bash
cd fichflow
git add src/config/plans.ts src/lib/constants.ts
git commit -m "feat: configuration plans GRATUIT/ARTISAN/PRO avec limites et feature gating"
```

---

### Task 10 : FichFlow — feature gating dans l'API generate

**Files:**
- Modify: `fichflow/src/app/api/products/generate/route.ts`

**Step 1: Ajouter le feature gating**

En haut du fichier, après les imports, ajouter :

```typescript
import { getPlanLimits } from "@/config/plans"
import type { Plan } from "@/generated/prisma/enums"
```

Après la vérification des crédits (`if (!user || user.credits < 1)`), ajouter :

```typescript
    // Feature gating selon le plan
    const limits = getPlanLimits(user.plan as Plan)

    // Limiter le nombre de photos selon le plan
    if (photos.length > limits.maxPhotosPerProduct) {
      return NextResponse.json(
        { error: `Votre plan est limité à ${limits.maxPhotosPerProduct} photo(s) par produit. Passez à un plan supérieur pour en ajouter davantage.` },
        { status: 403 }
      )
    }

    // Vérifier le ton
    if (!limits.availableTones.includes(tone)) {
      return NextResponse.json(
        { error: "Ce ton n'est pas disponible avec votre plan actuel." },
        { status: 403 }
      )
    }

    // Vérifier la limite de stockage
    if (limits.maxStoredProducts > 0) {
      const productCount = await prisma.product.count({ where: { userId: user.id } })
      if (productCount >= limits.maxStoredProducts) {
        return NextResponse.json(
          { error: `Limite de ${limits.maxStoredProducts} fiches atteinte. Supprimez des fiches ou passez à un plan supérieur.` },
          { status: 403 }
        )
      }
    }
```

Modifier l'appel à Claude pour utiliser le bon modèle selon le plan :

```typescript
    const response = await anthropic.messages.create({
      model: limits.aiModel, // Haiku pour FREE/ARTISAN, Sonnet pour PRO
      max_tokens: 2000,
      // ... reste identique
    })
```

**Step 2: Commit**

```bash
cd fichflow
git add src/app/api/products/generate/route.ts
git commit -m "feat: feature gating API generate (photos, tons, stockage, modèle IA par plan)"
```

---

### Task 11 : FichFlow — webhook Stripe abonnements

**Files:**
- Modify: `fichflow/src/app/api/stripe/webhook/route.ts`

**Step 1: Ajouter le traitement des événements abonnement**

Après le bloc `if (event.type === "checkout.session.completed")`, ajouter :

```typescript
  // ── Abonnement créé ou mis à jour ──
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const subscription = event.data.object as Stripe.Subscription
    const plan = subscription.metadata?.plan as string

    if (plan && ["FREE", "ARTISAN", "PRO"].includes(plan)) {
      const customerId = subscription.customer as string
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          plan: plan as "FREE" | "ARTISAN" | "PRO",
          stripeSubscriptionId: subscription.id,
        },
      })
      console.log(`Plan mis à jour: ${plan} pour customer ${customerId}`)
    }
  }

  // ── Abonnement supprimé (désabonnement) ──
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    await prisma.user.updateMany({
      where: { stripeCustomerId: customerId },
      data: {
        plan: "FREE",
        stripeSubscriptionId: null,
      },
    })
    console.log(`Désabonnement: customer ${customerId} repassé en FREE`)
  }

  // ── Facture payée (renouvellement abonnement = crédits mensuels) ──
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = invoice.subscription as string | null

    if (subscriptionId) {
      const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: subscriptionId },
      })

      if (user) {
        const { PLANS } = await import("@/config/plans")
        const planConfig = PLANS[user.plan as keyof typeof PLANS]
        const monthlyCredits = planConfig?.limits?.monthlyCredits || 0

        if (monthlyCredits > 0) {
          await prisma.$transaction([
            prisma.user.update({
              where: { id: user.id },
              data: { credits: { increment: monthlyCredits } },
            }),
            prisma.creditTransaction.create({
              data: {
                userId: user.id,
                type: "BONUS",
                amount: monthlyCredits,
                description: `Crédits mensuels plan ${planConfig.name} — ${monthlyCredits} crédits`,
                stripeSessionId: invoice.id,
              },
            }),
          ])
          console.log(`${monthlyCredits} crédits mensuels ajoutés pour ${user.email}`)
        }

        // Sync vers FactuPilot (abonnement)
        const { syncPaymentToFactuPilot } = await import("@/lib/factupilot-sync")
        const amount = (invoice.amount_paid || 0) / 100
        if (amount > 0) {
          syncPaymentToFactuPilot({
            source: "fichflow",
            client: { email: user.email, name: user.name || user.email },
            payment: {
              amount,
              description: `Abonnement ${planConfig.name} — renouvellement`,
              stripePaymentId: invoice.id,
              type: "subscription",
              date: new Date().toISOString(),
            },
          }).catch((err) => console.error("Erreur sync FactuPilot:", err))
        }
      }
    }
  }
```

**Step 2: Commit**

```bash
cd fichflow
git add src/app/api/stripe/webhook/route.ts
git commit -m "feat: webhook abonnements (create/update/delete) + crédits mensuels + sync"
```

---

### Task 12 : FichFlow — checkout abonnements

**Files:**
- Modify: `fichflow/src/app/api/stripe/checkout/route.ts`

**Step 1: Modifier le checkout pour supporter abonnements ET packs**

Le checkout doit gérer deux cas :
- `{ packId: "pack_50" }` → mode `payment` (existant)
- `{ plan: "ARTISAN", billing: "monthly" }` → mode `subscription` (nouveau)

Ajouter la logique abonnement :

```typescript
  // CAS 2 : Abonnement
  const plan = body.plan as string | undefined
  const billing = (body.billing as string) || "monthly"

  if (plan) {
    const { PLANS } = await import("@/config/plans")
    const planConfig = PLANS[plan as keyof typeof PLANS]
    if (!planConfig || planConfig.monthlyPrice === 0) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 })
    }

    const priceId = billing === "yearly"
      ? planConfig.stripePriceIds.yearly
      : planConfig.stripePriceIds.monthly

    if (!priceId) {
      return NextResponse.json({ error: "Prix Stripe non configuré." }, { status: 500 })
    }

    // Créer ou récupérer le customer Stripe
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { plan, user_id: user.id },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/abonnement?cancelled=true`,
    })

    return NextResponse.json({ url: session.url })
  }
```

**Step 2: Commit**

```bash
cd fichflow
git add src/app/api/stripe/checkout/route.ts
git commit -m "feat: checkout Stripe pour abonnements (monthly/yearly) + packs existants"
```

---

### Task 13 : FichFlow — page abonnement/billing

**Files:**
- Create: `fichflow/src/app/(dashboard)/abonnement/page.tsx`
- Modify: `fichflow/src/app/(dashboard)/credits/credits-view.tsx` (lien vers abonnement)

**Step 1: Créer la page abonnement**

Page serveur qui affiche :
- Le plan actuel de l'utilisateur avec badge
- Les 3 plans en cards (GRATUIT, ARTISAN, PRO) avec toggle mensuel/annuel
- Le plan actuel est marqué "Plan actuel"
- Les plans supérieurs ont un bouton "S'abonner"
- En dessous, les packs de crédits existants (déplacés depuis /credits ou en lien)
- Lien vers le Stripe Billing Portal pour gérer l'abonnement existant

La page doit inclure un composant client `BillingView` pour les interactions (toggle mensuel/annuel, boutons d'achat).

**Step 2: Ajouter un lien dans la navigation**

Modifier le sidebar/navigation pour ajouter un lien "Abonnement" qui remplace ou complète "Crédits".

**Step 3: Mettre à jour credits-view.tsx**

Ajouter un encart en haut : "Vous êtes sur le plan {planName}. Passez à un abonnement pour des crédits mensuels inclus et des fonctionnalités premium."

**Step 4: Commit**

```bash
cd fichflow
git add src/app/\(dashboard\)/abonnement/ src/app/\(dashboard\)/credits/
git commit -m "feat: page abonnement avec plans ARTISAN/PRO et toggle mensuel/annuel"
```

---

### Task 14 : FichFlow — Stripe Billing Portal

**Files:**
- Create: `fichflow/src/app/api/stripe/portal/route.ts`

**Step 1: Créer l'endpoint Billing Portal**

```typescript
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
```

**Step 2: Commit**

```bash
cd fichflow
git add src/app/api/stripe/portal/
git commit -m "feat: endpoint Stripe Billing Portal pour gestion abonnement"
```

---

### Task 15 : FichFlow — branding custom (settings + PDF)

**Files:**
- Create: `fichflow/src/app/(dashboard)/parametres/page.tsx` (page settings branding)
- Create: `fichflow/src/app/api/company/route.ts` (CRUD company/branding)
- Modify: `fichflow/src/components/pdf/ProductPdf.tsx` (injecter branding)

**Step 1: Créer l'endpoint API company**

Endpoint PATCH pour mettre à jour le nom, logo, couleur primaire de la company.
Upload du logo vers Supabase Storage (bucket `company-logos`).

**Step 2: Créer la page paramètres**

Page avec formulaire :
- Nom commercial (input text)
- Logo (dropzone, preview)
- Couleur primaire (input color)
- Bouton sauvegarder
- Gated : visible uniquement pour ARTISAN et PRO (sinon message "Passez à un plan supérieur")

**Step 3: Modifier ProductPdf.tsx pour le branding**

Si l'utilisateur a un plan ARTISAN ou PRO ET une company configurée :
- Remplacer le texte "FichFlow" par le nom commercial
- Remplacer la couleur d'accent par `primaryColor`
- Ajouter le logo en haut à gauche si `logoUrl` existe
- Le footer change de "Généré par FichFlow" à "Fiche produit — {companyName}"

Si plan FREE : garder le branding FichFlow (publicité gratuite).

**Step 4: Commit**

```bash
cd fichflow
git add src/app/\(dashboard\)/parametres/ src/app/api/company/ src/components/pdf/ProductPdf.tsx
git commit -m "feat: branding custom (logo, couleurs) sur les PDFs pour plans ARTISAN/PRO"
```

---

### Task 16 : FichFlow — mettre à jour le dashboard et la landing

**Files:**
- Modify: `fichflow/src/app/(dashboard)/dashboard/page.tsx` (afficher plan + crédits mensuels)
- Modify: `fichflow/src/app/page.tsx` (landing : afficher les plans au lieu des packs seuls)

**Step 1: Dashboard — afficher le plan**

Ajouter un KpiCard "Plan" qui affiche le plan actuel avec un lien "Gérer" vers /abonnement.
Modifier le KpiCard "Crédits" pour distinguer crédits restants (total) et crédits mensuels (si abonné).

**Step 2: Landing — section pricing**

Remplacer ou compléter la section pricing actuelle (packs uniquement) par :
- 3 cards plans (GRATUIT, ARTISAN, PRO) avec toggle mensuel/annuel
- En dessous, une section "Besoin ponctuel ? Nos packs de crédits" avec les 4 packs
- CTA sur chaque plan : "Commencer gratuitement" / "S'abonner" / "S'abonner"

**Step 3: Commit**

```bash
cd fichflow
git add src/app/\(dashboard\)/dashboard/page.tsx src/app/page.tsx
git commit -m "feat: dashboard plan info + landing page pricing abonnements et packs"
```

---

### Task 17 : Tests manuels et vérification

**Step 1: Vérifier le feature gating**

- Créer un user FREE → vérifier : 1 photo max, 3 tons, 10 fiches max, modèle Haiku
- Mettre manuellement le plan ARTISAN en DB → vérifier : 3 photos, 5 tons, illimité, Haiku, branding
- Mettre manuellement le plan PRO en DB → vérifier : Sonnet, lot, multi-langue

**Step 2: Tester la sync FactuPilot**

- Déclencher un achat de pack en dev
- Vérifier que le webhook appelle syncPaymentToFactuPilot
- Vérifier que la facture apparaît dans FactuPilot avec le badge "fichflow"
- Couper le réseau et vérifier que SyncQueue est peuplée
- Appeler manuellement le CRON sync-retry et vérifier le retry

**Step 3: Tester le checkout abonnement**

- Stripe CLI : `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Tester checkout subscription ARTISAN monthly
- Vérifier que le plan est mis à jour en DB
- Vérifier que les crédits mensuels sont ajoutés au renouvellement
- Tester l'annulation via Billing Portal → plan revient à FREE

**Step 4: Commit final**

```bash
cd fichflow
git add -A
git commit -m "chore: ajustements post-tests manuels"
```

---

## Résumé des variables d'environnement à ajouter

### Dans `SaaS/.env` (template)

```env
# Sync inter-SaaS (partagée)
SYNC_API_KEY=
FACTUPILOT_SYNC_URL=https://factupilot-dun.vercel.app

# FichFlow — Plans abonnement
FICHFLOW_STRIPE_ARTISAN_MONTHLY_PRICE_ID=
FICHFLOW_STRIPE_ARTISAN_YEARLY_PRICE_ID=
FICHFLOW_STRIPE_PRO_MONTHLY_PRICE_ID=
FICHFLOW_STRIPE_PRO_YEARLY_PRICE_ID=

# FichFlow — CRON
FICHFLOW_CRON_SECRET=
```

### Dans `SaaS/.env.local` (secrets)

```env
SYNC_API_KEY=sync_<64 chars aléatoires>
FACTUPILOT_SYNC_URL=https://factupilot-dun.vercel.app
FICHFLOW_STRIPE_ARTISAN_MONTHLY_PRICE_ID=price_xxx
FICHFLOW_STRIPE_ARTISAN_YEARLY_PRICE_ID=price_xxx
FICHFLOW_STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
FICHFLOW_STRIPE_PRO_YEARLY_PRICE_ID=price_xxx
FICHFLOW_CRON_SECRET=cron_<32 chars aléatoires>
```

## Produits Stripe à créer

Dans le Dashboard Stripe, créer :
1. **Produit "FichFlow Artisan"** → 2 prix : 7.90€/mois recurring + 75.90€/an recurring
2. **Produit "FichFlow Pro"** → 2 prix : 14.90€/mois recurring + 142.90€/an recurring

Reporter les price IDs dans les variables d'env.
