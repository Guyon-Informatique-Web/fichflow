import type { Metadata } from "next"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BrandingSettings } from "./branding-settings"

export const metadata: Metadata = {
  title: "Paramètres",
}

export default async function ParametresPage() {
  const user = await getAuthUser()

  const company = await prisma.company.findUnique({
    where: { userId: user.id },
  })

  return (
    <BrandingSettings
      plan={user.plan}
      isAdmin={user.role === "ADMIN"}
      company={company ? {
        id: company.id,
        name: company.name,
        logoUrl: company.logoUrl,
        primaryColor: company.primaryColor,
      } : null}
    />
  )
}
