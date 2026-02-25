"use client"

import { useState } from "react"
import { Palette, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface BrandingSettingsProps {
  plan: string
  company: {
    id: string
    name: string
    logoUrl: string | null
    primaryColor: string | null
  } | null
}

export function BrandingSettings({ plan, company }: BrandingSettingsProps) {
  const canBrand = plan === "ARTISAN" || plan === "PRO"
  const [name, setName] = useState(company?.name || "")
  const [primaryColor, setPrimaryColor] = useState(company?.primaryColor || "#0a0a0a")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Le nom commercial est requis.")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/company", {
        method: company ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), primaryColor }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de la sauvegarde.")
      }

      toast.success("Paramètres sauvegardés.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inattendue.")
    } finally {
      setSaving(false)
    }
  }

  if (!canBrand) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Personnalisez vos fiches produit</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">
              Branding personnalisé
            </h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Ajoutez votre logo et vos couleurs sur vos fiches produit PDF.
              Disponible avec les plans Artisan et Pro.
            </p>
            <Button asChild>
              <Link href="/abonnement">Voir les plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Personnalisez vos fiches produit</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nom commercial</Label>
            <Input
              id="company-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon Entreprise"
            />
            <p className="text-xs text-muted-foreground">
              Affiché sur vos PDFs à la place de &quot;FichFlow&quot;
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary-color">Couleur principale</Label>
            <div className="flex items-center gap-3">
              <input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-32"
                placeholder="#0a0a0a"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Utilisée pour les titres et accents sur vos PDFs
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              "Sauvegarder"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
