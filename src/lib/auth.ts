import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { FREE_CREDITS } from "@/lib/constants";
import { redirect } from "next/navigation";

// Récupérer l'utilisateur authentifié (Supabase + Prisma)
// Redirige vers /connexion si non authentifié
export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) {
    redirect("/connexion");
  }

  // Sync/récupérer l'utilisateur Prisma
  const user = await prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: { email: supabaseUser.email! },
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: supabaseUser.user_metadata?.name ?? null,
      credits: FREE_CREDITS,
    },
  });

  return user;
}

// Récupérer l'utilisateur admin authentifié
// Redirige vers /dashboard si l'utilisateur n'est pas admin
export async function getRequireAdminUser() {
  const user = await getAuthUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}
