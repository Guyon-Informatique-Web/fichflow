"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Coins,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Liens définis ici (composant client) car les icônes Lucide ne peuvent pas
// être passées en prop depuis un Server Component
const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/produits", label: "Mes produits", icon: Package },
  { href: "/produits/nouveau", label: "Nouvelle fiche", icon: PlusCircle },
  { href: "/credits", label: "Crédits", icon: Coins },
  { href: "/compte", label: "Mon compte", icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-3">
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        // Actif si le pathname correspond exactement ou est un sous-chemin
        const isActive =
          pathname === href ||
          (href !== "/dashboard" && pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
