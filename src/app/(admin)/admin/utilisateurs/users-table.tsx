"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface UsersTableProps {
  users: UserRow[];
}

export function UsersTable({ users }: UsersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filtrer les utilisateurs par recherche
  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Ajouter des crédits bonus à un utilisateur
  async function handleAddCredits() {
    if (!selectedUser || !creditAmount) return;

    const amount = parseInt(creditAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Montant invalide.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, amount }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur.");
      }

      toast.success(
        `${amount} crédit${amount !== 1 ? "s" : ""} ajouté${amount !== 1 ? "s" : ""} à ${selectedUser.email}`
      );
      setDialogOpen(false);
      setCreditAmount("");
      setSelectedUser(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur inattendue."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par email ou nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
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
                      {format(new Date(user.createdAt), "dd/MM/yyyy", {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={dialogOpen && selectedUser?.id === user.id}
                        onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (open) {
                            setSelectedUser(user);
                            setCreditAmount("");
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="xs">
                            <Plus className="mr-1 h-3 w-3" />
                            Crédits
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ajouter des crédits</DialogTitle>
                            <DialogDescription>
                              Ajouter des crédits bonus à {user.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="credit-amount">
                                Nombre de crédits
                              </Label>
                              <Input
                                id="credit-amount"
                                type="number"
                                min="1"
                                value={creditAmount}
                                onChange={(e) => setCreditAmount(e.target.value)}
                                placeholder="10"
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Solde actuel : {user.credits} crédit
                              {user.credits !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleAddCredits}
                              disabled={loading || !creditAmount}
                            >
                              {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Plus className="mr-2 h-4 w-4" />
                              )}
                              Ajouter
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
