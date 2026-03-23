"use client"

import { useState } from "react"
import { Palette, Loader2, Lock, FileText, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface BrandingSettingsProps {
  plan: string
  isAdmin?: boolean
  company: {
    id: string
    name: string
    logoUrl: string | null
    primaryColor: string | null
  } | null
}

export function BrandingSettings({ plan, isAdmin = false, company }: BrandingSettingsProps) {
  const canBrand = plan === "ARTISAN" || plan === "PRO" || isAdmin
  const [name, setName] = useState(company?.name || "")
  const [primaryColor, setPrimaryColor] = useState(company?.primaryColor || "#00d296")
  const [defaultTone, setDefaultTone] = useState("PROFESSIONNEL")
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
            <h2 className="mb-2 text-lg font-semibold">Branding personnalisé</h2>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Ajoutez votre logo et couleurs sur vos fiches produit PDF.
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

      {/* Branding */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Branding PDF</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nom commercial</Label>
            <Input
              id="company-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon Entreprise"
            />
            <p className="text-xs text-muted-foreground">
              Affiché sur vos PDFs à la place de &ldquo;FichFlow&rdquo;
            </p>
          </div>

          <div className="space-y-3">
            <Label>Couleur principale</Label>
            {/* Palette prédéfinie */}
            <div className="flex flex-wrap gap-2">
              {[
                { hex: "#00d296", name: "Vert" },
                { hex: "#3b82f6", name: "Bleu" },
                { hex: "#8b5cf6", name: "Violet" },
                { hex: "#f59e0b", name: "Ambre" },
                { hex: "#ef4444", name: "Rouge" },
                { hex: "#ec4899", name: "Rose" },
                { hex: "#14b8a6", name: "Teal" },
                { hex: "#f97316", name: "Orange" },
                { hex: "#0f172a", name: "Noir" },
                { hex: "#6b7280", name: "Gris" },
              ].map(({ hex, name }) => (
                <button
                  key={hex}
                  type="button"
                  title={name}
                  onClick={() => setPrimaryColor(hex)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    primaryColor.toLowerCase() === hex ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            {/* Input hex avancé */}
            <details className="group">
              <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground list-none flex items-center gap-1">
                <span className="group-open:hidden">▶ Code couleur personnalisé</span>
                <span className="hidden group-open:inline">▼ Code couleur personnalisé</span>
              </summary>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-md border"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-32 font-mono text-sm"
                  placeholder="#00d296"
                />
              </div>
            </details>
            <p className="text-xs text-muted-foreground">
              Utilisée pour les titres et accents sur vos PDFs
            </p>
          </div>

          {/* Prévisualisation mini PDF */}
          <div className="rounded-lg border bg-white p-4 text-black">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" style={{ color: primaryColor }} />
              <span className="text-sm font-bold" style={{ color: primaryColor }}>
                {name || "Votre Entreprise"}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: primaryColor }} />
            <div className="mt-2 space-y-1">
              <div className="h-2 w-3/4 rounded bg-gray-200" />
              <div className="h-2 w-1/2 rounded bg-gray-100" />
            </div>
            <p className="mt-2 text-[10px] text-gray-400">Aperçu de votre en-tête PDF</p>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sauvegarder le branding
          </Button>
        </CardContent>
      </Card>

      {/* Ton par défaut */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Ton par défaut</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ton présélectionné lors de la création d&apos;une nouvelle fiche
          </p>
          <Select value={defaultTone} onValueChange={setDefaultTone}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PROFESSIONNEL">💼 Professionnel</SelectItem>
              <SelectItem value="DECONTRACTE">😎 Décontracté</SelectItem>
              <SelectItem value="SENSUEL">✨ Sensuel</SelectItem>
              <SelectItem value="LUXE">👑 Luxe</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Vous pourrez toujours changer le ton lors de la création.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
