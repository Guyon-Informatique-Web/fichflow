import type { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Coins, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Activité",
};

export default async function ActivitePage() {
  // Récupérer les dernières transactions et fiches en parallèle
  const [recentTransactions, recentProducts] = await Promise.all([
    prisma.creditTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { user: { select: { email: true } } },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        category: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
  ]);

  // Fusionner et trier par date
  type ActivityItem = {
    id: string;
    type: "transaction" | "product";
    date: Date;
    email: string;
    label: string;
    detail: string;
    badge: { text: string; variant: "default" | "secondary" | "destructive" };
  };

  const activities: ActivityItem[] = [
    ...recentTransactions.map((tx) => ({
      id: `tx-${tx.id}`,
      type: "transaction" as const,
      date: tx.createdAt,
      email: tx.user.email,
      label: tx.description,
      detail: `${tx.amount > 0 ? "+" : ""}${tx.amount} crédit${Math.abs(tx.amount) !== 1 ? "s" : ""}`,
      badge: {
        text: tx.type === "PURCHASE" ? "Achat" : tx.type === "BONUS" ? "Bonus" : "Utilisation",
        variant: (tx.type === "PURCHASE" ? "default" : tx.type === "BONUS" ? "secondary" : "destructive") as "default" | "secondary" | "destructive",
      },
    })),
    ...recentProducts.map((p) => ({
      id: `prod-${p.id}`,
      type: "product" as const,
      date: p.createdAt,
      email: p.user.email,
      label: p.name,
      detail: p.category,
      badge: { text: "Fiche", variant: "secondary" as const },
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 30);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activité récente</h1>
        <p className="text-muted-foreground">
          Dernières transactions et fiches créées
        </p>
      </div>

      {activities.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              Aucune activité pour le moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="mt-0.5 rounded-full bg-muted p-2">
                    {item.type === "transaction" ? (
                      <Coins className="h-4 w-4 text-amber-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.badge.variant}>
                        {item.badge.text}
                      </Badge>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.email} — {item.detail}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {format(item.date, "dd/MM HH:mm", { locale: fr })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
