import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Callback pour la confirmation d'email Supabase
// Gère : confirmation d'email, magic link, reset password
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const nextParam = searchParams.get("next");

  // Si type=recovery (reset password), toujours aller vers /reset-password
  const next = nextParam ?? (type === "recovery" ? "/reset-password" : "/dashboard");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // En cas d'erreur, rediriger vers la page de connexion
  return NextResponse.redirect(`${origin}/connexion?error=link_expired`);
}
