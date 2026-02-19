"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, FileDown, Loader2, Pencil, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Product, ExportHistory } from "@/generated/prisma/client";

interface ProductWithExports extends Product {
  exports: ExportHistory[];
}

interface ProductViewProps {
  product: ProductWithExports;
}

export function ProductView({ product }: ProductViewProps) {
  const router = useRouter();

  // Champs éditables (custom prend la priorité sur generated)
  const [title, setTitle] = useState(
    product.customTitle || product.generatedTitle || ""
  );
  const [description, setDescription] = useState(
    product.customDescription || product.generatedDescription || ""
  );
  const [characteristics, setCharacteristics] = useState<Record<string, string>>(
    (product.customCharacteristics as Record<string, string>) ||
      (product.generatedCharacteristics as Record<string, string>) ||
      {}
  );

  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sauvegarder les modifications
  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customTitle: title,
          customDescription: description,
          customCharacteristics: characteristics,
        }),
      });

      if (!response.ok) throw new Error("Erreur de sauvegarde.");

      toast.success("Modifications sauvegardées.");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  // Supprimer le produit
  async function handleDelete() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur de suppression.");

      toast.success("Produit supprimé.");
      router.push("/produits");
    } catch {
      toast.error("Erreur lors de la suppression.");
      setDeleting(false);
    }
  }

  // Export PDF
  async function handleExportPdf() {
    setExporting(true);
    try {
      const response = await fetch(`/api/products/${product.id}/export/pdf`);
      if (!response.ok) throw new Error("Erreur d'export.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${product.name.replace(/\s+/g, "-").toLowerCase()}-fiche.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("PDF téléchargé !");
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'export PDF.");
    } finally {
      setExporting(false);
    }
  }

  // Modifier une caractéristique
  function updateCharacteristic(key: string, value: string) {
    setCharacteristics((prev) => ({ ...prev, [key]: value }));
  }

  // Supprimer une caractéristique
  function removeCharacteristic(key: string) {
    setCharacteristics((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  // Vérifier si des modifications ont été faites
  const hasChanges =
    title !== (product.customTitle || product.generatedTitle || "") ||
    description !== (product.customDescription || product.generatedDescription || "") ||
    JSON.stringify(characteristics) !==
      JSON.stringify(
        (product.customCharacteristics as Record<string, string>) ||
          (product.generatedCharacteristics as Record<string, string>) ||
          {}
      );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/produits">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          <Badge variant={product.status === "COMPLETED" ? "default" : "secondary"}>
            {product.status === "COMPLETED" ? "Terminée" : "Brouillon"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={deleting}>
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Le produit, ses photos et ses exports seront définitivement supprimés.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Supprimer définitivement
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {hasChanges && (
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Sauvegarder
            </Button>
          )}
          <Button
            onClick={handleExportPdf}
            disabled={exporting}
            variant="outline"
            size="sm"
          >
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche : photos */}
        <div className="space-y-4">
          {product.photos.map((url, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <img
                src={url}
                alt={`${product.name} — photo ${i + 1}`}
                className="w-full object-cover"
              />
            </div>
          ))}
          <Card>
            <CardContent className="p-4 text-sm">
              <p>
                <strong>Catégorie :</strong> {product.category}
              </p>
              {product.price && (
                <p>
                  <strong>Prix :</strong> {Number(product.price).toFixed(2)}€
                </p>
              )}
              <p>
                <strong>Ton :</strong> {product.tone.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite : contenu éditable */}
        <div className="space-y-6 lg:col-span-2">
          {/* Titre */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Titre
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEditingField(editingField === "title" ? null : "title")
                  }
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingField === "title" ? (
                <div className="flex gap-2">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField(null)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <h2 className="text-xl font-bold">{title}</h2>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  Description
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEditingField(
                      editingField === "description" ? null : "description"
                    )
                  }
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingField === "description" ? (
                <div className="space-y-2">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={10}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingField(null)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Terminé
                  </Button>
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {description}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Caractéristiques */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Caractéristiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(characteristics).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="min-w-[120px] text-sm font-medium">
                      {key}
                    </span>
                    <Input
                      value={value}
                      onChange={(e) => updateCharacteristic(key, e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCharacteristic(key)}
                      className="text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
