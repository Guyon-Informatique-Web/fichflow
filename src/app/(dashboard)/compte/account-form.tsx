"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountFormProps {
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export function AccountForm({ email, name: initialName, role, createdAt }: AccountFormProps) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  const hasChanges = name !== initialName;

  async function handleSave() {
    if (!hasChanges) return;

    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur de sauvegarde.");
      }

      toast.success("Profil mis à jour.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur inattendue."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email (lecture seule) */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled />
          </div>

          {/* Nom (éditable) */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
            />
          </div>

          {/* Rôle */}
          <div className="space-y-2">
            <Label>Rôle</Label>
            <div>
              <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
                {role === "ADMIN" ? "Administrateur" : "Utilisateur"}
              </Badge>
            </div>
          </div>

          {/* Date de création */}
          <div className="space-y-2">
            <Label>Membre depuis</Label>
            <p className="text-sm text-muted-foreground">
              {format(new Date(createdAt), "dd MMMM yyyy", { locale: fr })}
            </p>
          </div>

          {/* Bouton sauvegarder */}
          {hasChanges && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Sauvegarder
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
