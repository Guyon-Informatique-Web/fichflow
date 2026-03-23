"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Coins,
  User,
  Settings,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/produits", label: "Mes produits", icon: Package, exact: false },
  { href: "/produits/nouveau", label: "Nouvelle fiche", icon: PlusCircle, exact: true },
  { href: "/credits", label: "Crédits", icon: Coins, exact: false },
  { href: "/abonnement", label: "Abonnement", icon: CreditCard, exact: true },
];

const ACCOUNT_LINKS = [
  { href: "/compte", label: "Mon compte", icon: User },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="flex-1 p-3">
      {/* Navigation principale */}
      <div className="space-y-1">
        {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive(href, exact)
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </div>

      {/* Séparateur */}
      <div className="my-3 border-t" />

      {/* Compte */}
      <div className="space-y-1">
        {ACCOUNT_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive(href)
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
