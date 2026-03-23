"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface BulkGenerateFormProps {
  credits: number;
}

interface BulkItem {
  id: string;
  file: File;
  preview: string;
  name: string;
  status: "pending" | "generating" | "done" | "error";
  productId?: string;
  error?: string;
}

export function BulkGenerateForm({ credits }: BulkGenerateFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<BulkItem[]>([]);
  const [tone, setTone] = useState("PROFESSIONNEL");
  const [isRunning, setIsRunning] = useState(false);

  const MAX_ITEMS = 10;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems: BulkItem[] = acceptedFiles
      .slice(0, MAX_ITEMS - items.length)
      .map((file) => ({
        id: Math.random().toString(36).slice(2),
        file,
        preview: URL.createObjectURL(file),
        name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        status: "pending" as const,
      }));
    setItems((prev) => [...prev, ...newItems].slice(0, MAX_ITEMS));
  }, [items.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: MAX_ITEMS,
    disabled: isRunning || items.length >= MAX_ITEMS,
  });

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function runBulk() {
    const pending = items.filter((i) => i.status === "pending");
    if (pending.length === 0) return;
    if (credits < pending.length) {
      toast.error(`Crédits insuffisants. Il vous en faut ${pending.length}, vous en avez ${credits}.`);
      return;
    }

    setIsRunning(true);

    for (const item of pending) {
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: "generating" } : i));

      try {
        const formData = new FormData();
        formData.append("photos", item.file);
        formData.append("name", item.name);
        formData.append("category", "Produit");
        formData.append("tone", tone);

        const res = await fetch("/api/products/generate", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erreur de génération");

        setItems((prev) => prev.map((i) =>
          i.id === item.id ? { ...i, status: "done", productId: data.productId } : i
        ));
      } catch (e) {
        setItems((prev) => prev.map((i) =>
          i.id === item.id ? { ...i, status: "error", error: e instanceof Error ? e.message : "Erreur" } : i
        ));
      }
    }

    setIsRunning(false);
    toast.success("Génération terminée !");
    router.refresh();
  }

  const done = items.filter((i) => i.status === "done").length;
  const errors = items.filter((i) => i.status === "error").length;
  const pending = items.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Infos */}
      <div className="flex items-center gap-4 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
        <span className="text-muted-foreground">Crédits disponibles :</span>
        <span className="font-semibold">{credits}</span>
        <span className="mx-2 text-muted-foreground">·</span>
        <span className="text-muted-foreground">Max :</span>
        <span className="font-semibold">{MAX_ITEMS} photos</span>
        <span className="mx-2 text-muted-foreground">·</span>
        <span className="text-muted-foreground">Sélectionnées :</span>
        <span className="font-semibold">{items.length}</span>
      </div>

      {/* Ton */}
      <div className="flex items-center gap-4">
        <Label>Ton pour toutes les fiches</Label>
        <Select value={tone} onValueChange={setTone}>
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
      </div>

      {/* Zone de drop */}
      {items.length < MAX_ITEMS && (
        <div
          {...getRootProps()}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
          } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">
            {isDragActive ? "Déposez ici..." : "Glissez vos photos ou cliquez"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            JPG, PNG, WebP · Max {MAX_ITEMS} photos · 1 crédit par fiche
          </p>
        </div>
      )}

      {/* Grille des items */}
      {items.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="relative rounded-lg border overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.preview} alt={item.name} className="aspect-square w-full object-cover" />

              {/* Overlay statut */}
              <div className={`absolute inset-0 flex items-center justify-center ${
                item.status === "generating" ? "bg-black/50" :
                item.status === "done" ? "bg-green-500/20" :
                item.status === "error" ? "bg-red-500/20" : ""
              }`}>
                {item.status === "generating" && <Loader2 className="h-8 w-8 animate-spin text-white" />}
                {item.status === "done" && <CheckCircle2 className="h-8 w-8 text-green-500" />}
                {item.status === "error" && <AlertCircle className="h-8 w-8 text-red-500" />}
              </div>

              {/* Supprimer */}
              {item.status === "pending" && !isRunning && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                >
                  <X className="h-3 w-3" />
                </button>
              )}

              {/* Nom */}
              <div className="p-2">
                <p className="truncate text-xs font-medium">{item.name}</p>
                {item.status === "done" && item.productId && (
                  <a href={`/produits/${item.productId}`} className="text-xs text-primary hover:underline">
                    Voir la fiche →
                  </a>
                )}
                {item.status === "error" && (
                  <p className="text-xs text-destructive">{item.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Résumé + lancer */}
      {items.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex gap-3 text-sm">
            {done > 0 && <Badge variant="secondary" className="text-green-600">{done} générée{done > 1 ? "s" : ""}</Badge>}
            {errors > 0 && <Badge variant="destructive">{errors} erreur{errors > 1 ? "s" : ""}</Badge>}
            {pending > 0 && <Badge variant="outline">{pending} en attente</Badge>}
          </div>
          <Button onClick={runBulk} disabled={isRunning || pending === 0} className="gap-2">
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isRunning ? "Génération en cours..." : `Générer ${pending} fiche${pending > 1 ? "s" : ""}`}
          </Button>
        </div>
      )}
    </div>
  );
}
