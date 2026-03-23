import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandling } from "@/lib/api-error-handler";

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } });
  return dbUser?.role === "ADMIN" ? user : null;
}

// PATCH — changer le rôle ou les crédits d'un utilisateur
export const PATCH = withErrorHandling(async (request) => {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const { userId, role, credits } = await request.json();
  if (!userId) return NextResponse.json({ error: "userId requis." }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (role !== undefined) data.role = role;
  if (typeof credits === "number") data.credits = Math.max(0, credits);

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, role: true, credits: true },
  });

  return NextResponse.json({ success: true, user: updated });
});

// DELETE — supprimer un utilisateur
export const DELETE = withErrorHandling(async (request) => {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ error: "userId requis." }, { status: 400 });

  // Empêcher la suppression de soi-même
  if (userId === admin.id) {
    return NextResponse.json({ error: "Impossible de supprimer votre propre compte." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ success: true });
});
