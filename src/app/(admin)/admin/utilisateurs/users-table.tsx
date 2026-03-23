"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, Plus, Loader2, Trash2, ShieldCheck, ShieldOff, Minus, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: string;
  credits: number;
  createdAt: string;
  productCount: number;
}

export function UsersTable({ users: initialUsers }: { users: UserRow[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditMode, setCreditMode] = useState<"add" | "remove">("add");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Ajouter / retirer des crédits
  async function handleCredits() {
    if (!selectedUser || !creditAmount) return;
    const amount = parseInt(creditAmount, 10);
    if (isNaN(amount) || amount <= 0) { toast.error("Montant invalide."); return; }

    const finalAmount = creditMode === "add" ? amount : -amount;
    setLoading("credits");
    try {
      const res = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, amount: finalAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Crédits mis à jour. Nouveau solde : ${data.credits}`);
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, credits: data.credits } : u));
      setDialogOpen(false);
      setCreditAmount("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setLoading(null);
    }
  }

  // Changer le rôle
  async function handleToggleRole(user: UserRow) {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    setLoading(`role-${user.id}`);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Rôle changé en ${newRole}.`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setLoading(null);
    }
  }

  // Supprimer un utilisateur
  async function handleDelete(user: UserRow) {
    setLoading(`delete-${user.id}`);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${user.email} supprimé.`);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par email ou nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="text-center">Crédits</TableHead>
                <TableHead className="text-center">Produits</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role === "ADMIN" ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{user.credits}</TableCell>
                    <TableCell className="text-center">{user.productCount}</TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">

                        {/* Voir les fiches */}
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Voir les fiches">
                          <Link href={`/admin/documents?user=${user.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        {/* Changer le rôle */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title={user.role === "ADMIN" ? "Rétrograder en User" : "Promouvoir en Admin"}
                          disabled={loading === `role-${user.id}`}
                          onClick={() => handleToggleRole(user)}
                        >
                          {loading === `role-${user.id}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : user.role === "ADMIN" ? (
                            <ShieldOff className="h-4 w-4 text-amber-500" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                          )}
                        </Button>

                        {/* Crédits */}
                        <Dialog
                          open={dialogOpen && selectedUser?.id === user.id}
                          onOpenChange={(open) => {
                            setDialogOpen(open);
                            if (open) { setSelectedUser(user); setCreditAmount(""); setCreditMode("add"); }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              <Plus className="mr-1 h-3 w-3" />
                              Crédits
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Gérer les crédits</DialogTitle>
                              <DialogDescription>{user.email} — solde actuel : {user.credits} crédit{user.credits !== 1 ? "s" : ""}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex gap-2">
                                <Button
                                  variant={creditMode === "add" ? "default" : "outline"}
                                  size="sm" className="flex-1"
                                  onClick={() => setCreditMode("add")}
                                >
                                  <Plus className="mr-1 h-3 w-3" /> Ajouter
                                </Button>
                                <Button
                                  variant={creditMode === "remove" ? "destructive" : "outline"}
                                  size="sm" className="flex-1"
                                  onClick={() => setCreditMode("remove")}
                                >
                                  <Minus className="mr-1 h-3 w-3" /> Retirer
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="credit-amount">Nombre de crédits</Label>
                                <Input
                                  id="credit-amount"
                                  type="number" min="1"
                                  value={creditAmount}
                                  onChange={(e) => setCreditAmount(e.target.value)}
                                  placeholder="10"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={handleCredits}
                                disabled={loading === "credits" || !creditAmount}
                                variant={creditMode === "remove" ? "destructive" : "default"}
                              >
                                {loading === "credits" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {creditMode === "add" ? "Ajouter" : "Retirer"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Supprimer */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              disabled={loading === `delete-${user.id}`}
                              title="Supprimer l'utilisateur"
                            >
                              {loading === `delete-${user.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer {user.email} ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. Toutes les fiches produit de cet utilisateur seront supprimées.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(user)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer définitivement
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {filtered.length} utilisateur{filtered.length !== 1 ? "s" : ""}
        {search && ` trouvé${filtered.length !== 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
