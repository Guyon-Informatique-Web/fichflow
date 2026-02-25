// API CRUD pour le profil entreprise (branding)

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { withErrorHandling } from "@/lib/api-error-handler"

// Créer le profil entreprise
export const POST = withErrorHandling(async (request) => {
  const supabase = await createClient()
  const { data: { user: supabaseUser } } = await supabase.auth.getUser()

  if (!supabaseUser) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  // Vérifier que le plan autorise le branding
  const user = await prisma.user.findUnique({ where: { id: supabaseUser.id } })
  if (!user || (user.plan !== "ARTISAN" && user.plan !== "PRO")) {
    return NextResponse.json(
      { error: "Le branding est réservé aux plans Artisan et Pro." },
      { status: 403 }
    )
  }

  // Vérifier qu'il n'existe pas déjà
  const existing = await prisma.company.findUnique({ where: { userId: user.id } })
  if (existing) {
    return NextResponse.json({ error: "Profil déjà existant, utilisez PATCH." }, { status: 409 })
  }

  const body = await request.json()
  const { name, primaryColor } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 })
  }

  const company = await prisma.company.create({
    data: {
      userId: user.id,
      name: name.trim(),
      primaryColor: primaryColor || null,
    },
  })

  return NextResponse.json(company)
})

// Mettre à jour le profil entreprise
export const PATCH = withErrorHandling(async (request) => {
  const supabase = await createClient()
  const { data: { user: supabaseUser } } = await supabase.auth.getUser()

  if (!supabaseUser) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: supabaseUser.id } })
  if (!user || (user.plan !== "ARTISAN" && user.plan !== "PRO")) {
    return NextResponse.json(
      { error: "Le branding est réservé aux plans Artisan et Pro." },
      { status: 403 }
    )
  }

  const company = await prisma.company.findUnique({ where: { userId: user.id } })
  if (!company) {
    return NextResponse.json({ error: "Profil non trouvé." }, { status: 404 })
  }

  const body = await request.json()
  const { name, primaryColor } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 })
  }

  const updated = await prisma.company.update({
    where: { id: company.id },
    data: {
      name: name.trim(),
      primaryColor: primaryColor || null,
    },
  })

  return NextResponse.json(updated)
})
