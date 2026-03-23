"use client";

import { useState } from "react";
import { Loader2, Save, Eye, EyeOff, Lock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

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

  // Changement de mot de passe
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

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

  async function handleChangePassword() {
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    setSavingPwd(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      toast.success("Mot de passe mis à jour.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inattendue.");
    } finally {
      setSavingPwd(false);
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
      {/* Sécurité — Changer le mot de passe */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Sécurité</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPwd ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8 caractères minimum"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPwd(!showNewPwd)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={savingPwd || !newPassword || !confirmPassword}
            variant="outline"
          >
            {savingPwd ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            Changer le mot de passe
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
