import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Coins,
  LogOut,
  User,
  Shield,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { getAuthUser } from "@/lib/auth";
import { logoutAction } from "../(auth)/actions";

export const metadata: Metadata = {
  title: {
    template: "%s — FichFlow",
    default: "Dashboard — FichFlow",
  },
};

// Liens pour le menu mobile (icônes utilisées directement en JSX, pas passées en prop)
const MOBILE_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/produits", label: "Mes produits", icon: Package },
  { href: "/produits/nouveau", label: "Nouvelle fiche", icon: PlusCircle },
  { href: "/credits", label: "Crédits", icon: Coins },
  { href: "/compte", label: "Mon compte", icon: User },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar lg:flex">
        <div className="p-4">
          <Link href="/dashboard" className="text-xl font-bold">
            FichFlow
          </Link>
        </div>

        <Separator />

        {/* Navigation avec état actif (composant client, liens définis en interne) */}
        <SidebarNav />

        {/* Lien admin si l'utilisateur est admin */}
        {isAdmin && (
          <>
            <Separator />
            <div className="p-3">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Shield className="h-4 w-4" />
                Administration
              </Link>
            </div>
          </>
        )}

        <Separator />

        {/* Infos utilisateur + déconnexion */}
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">
              {user.credits} crédit{user.credits !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="mb-3 truncate text-xs text-muted-foreground">
            {user.email}
          </p>
          <form action={logoutAction}>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </form>
        </div>
      </aside>

      {/* Header mobile avec Sheet */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b p-4 lg:hidden">
          <Link href="/dashboard" className="text-xl font-bold">
            FichFlow
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                {/* Solde crédits */}
                <div className="flex items-center gap-2 px-2">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">
                    {user.credits} crédit{user.credits !== 1 ? "s" : ""}
                  </span>
                </div>

                <Separator />

                {/* Liens de navigation */}
                <nav className="space-y-1">
                  {MOBILE_NAV_LINKS.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Shield className="h-4 w-4" />
                      Administration
                    </Link>
                  )}
                </nav>

                <Separator />

                {/* Email + déconnexion */}
                <div className="space-y-3 px-2">
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <form action={logoutAction}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Button>
                  </form>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
