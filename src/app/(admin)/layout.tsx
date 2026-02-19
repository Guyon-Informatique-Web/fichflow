import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Activity,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getRequireAdminUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    template: "%s — Admin FichFlow",
    default: "Administration — FichFlow",
  },
};

// Liens de navigation admin
const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/activite", label: "Activité", icon: Activity },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérifie que l'utilisateur est admin (redirige sinon)
  await getRequireAdminUser();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar admin */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar lg:flex">
        <div className="flex items-center gap-2 p-4">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold">FichFlow</span>
          <Badge variant="default" className="ml-auto text-xs">
            ADMIN
          </Badge>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 p-3">
          {ADMIN_NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <Separator />

        {/* Retour au dashboard */}
        <div className="p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard
          </Link>
        </div>
      </aside>

      {/* Header mobile admin */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold">Admin</span>
          </div>
          <nav className="flex items-center gap-2">
            {ADMIN_NAV_LINKS.map(({ href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="rounded-md p-2 transition-colors hover:bg-accent"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="rounded-md p-2 transition-colors hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </nav>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
