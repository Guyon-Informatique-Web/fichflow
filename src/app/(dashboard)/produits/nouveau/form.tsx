"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  TONES,
  DEFAULT_CATEGORIES,
  MAX_PHOTOS_PER_PRODUCT,
  MAX_PHOTO_SIZE_MB,
  ACCEPTED_IMAGE_TYPES,
  CATEGORY_PLACEHOLDERS,
} from "@/lib/constants";

interface NouveauProduitFormProps {
  credits: number;
}

export function NouveauProduitForm({ credits }: NouveauProduitFormProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [tone, setTone] = useState("PROFESSIONNEL");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Gestion du drag & drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remaining = MAX_PHOTOS_PER_PRODUCT - files.length;
      const newFiles = acceptedFiles.slice(0, remaining);

      setFiles((prev) => [...prev, ...newFiles]);
      // Créer les prévisualisations
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    },
    [files.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": ACCEPTED_IMAGE_TYPES.map((t) => `.${t.split("/")[1]}`) },
    maxSize: MAX_PHOTO_SIZE_MB * 1024 * 1024,
    maxFiles: MAX_PHOTOS_PER_PRODUCT - files.length,
    disabled: files.length >= MAX_PHOTOS_PER_PRODUCT,
  });

  // Supprimer une photo
  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // Soumission du formulaire
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Ajoutez au moins une photo du produit.");
      return;
    }

    if (credits < 1) {
      toast.error("Crédits insuffisants. Achetez un pack pour continuer.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Ajouter les fichiers photos
      files.forEach((file) => {
        formData.append("photos", file);
      });

      // Ajouter le ton (géré par le state, pas par un input natif)
      formData.set("tone", tone);
      formData.set("category", category);

      const response = await fetch("/api/products/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la génération.");
      }

      const { productId } = await response.json();

      toast.success("Fiche produit générée avec succès !");
      router.push(`/produits/${productId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur inattendue."
      );
    } finally {
      setLoading(false);
    }
  }

  // Placeholders dynamiques selon la catégorie sélectionnée
  const placeholders = category ? CATEGORY_PLACEHOLDERS[category] : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Upload photos */}
      <div className="space-y-2">
        <Label>
          Photo{MAX_PHOTOS_PER_PRODUCT > 1 ? "s" : ""} du produit{" "}
          <span className="text-muted-foreground">
            ({files.length}/{MAX_PHOTOS_PER_PRODUCT})
          </span>
        </Label>

        {/* Zone de drop */}
        {files.length < MAX_PHOTOS_PER_PRODUCT && (
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Déposez la photo ici..."
                : "Glissez-déposez une photo ou cliquez pour sélectionner"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPEG, PNG ou WebP — {MAX_PHOTO_SIZE_MB} Mo max
            </p>
          </div>
        )}

        {/* Prévisualisations */}
        {previews.length > 0 && (
          <div className="flex gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-lg border">
                  <img
                    src={preview}
                    alt={`Photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {DEFAULT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nom du produit */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom du produit</Label>
        <Input
          id="name"
          name="name"
          placeholder={placeholders?.namePlaceholder ?? "Ex : Mon produit"}
          required
        />
      </div>

      {/* Prix (optionnel) */}
      <div className="space-y-2">
        <Label htmlFor="price">
          Prix <span className="text-muted-foreground">(optionnel)</span>
        </Label>
        <div className="relative">
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="29.90"
            className="pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            €
          </span>
        </div>
      </div>

      {/* Ton */}
      <div className="space-y-2">
        <Label>Ton de la description</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TONES.filter((t) => t.value !== "PERSONNALISE").map((t) => (
            <Card
              key={t.value}
              className={`cursor-pointer transition-colors ${
                tone === t.value
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setTone(t.value)}
            >
              <CardContent className="p-3 text-center">
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">
                  {t.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Notes supplémentaires */}
      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes supplémentaires{" "}
          <span className="text-muted-foreground">(optionnel)</span>
        </Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder={placeholders?.notesPlaceholder ?? "Informations utiles pour la génération : matière, taille, public cible, mots-clés..."}
          rows={3}
        />
      </div>

      {/* Bouton de soumission */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="text-sm">
          <p className="font-medium">Coût : 1 crédit</p>
          <p className="text-muted-foreground">
            Solde actuel : {credits} crédit{credits !== 1 ? "s" : ""}
          </p>
        </div>
        <Button type="submit" disabled={loading || credits < 1} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            "Générer la fiche"
          )}
        </Button>
      </div>
    </form>
  );
}
