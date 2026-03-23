import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Callback pour la confirmation d'email Supabase
// Gère : confirmation d'email, magic link, reset password
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Rediriger vers reset-password si c'est un flow de récupération
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // En cas d'erreur, rediriger vers la page de connexion
  return NextResponse.redirect(`${origin}/connexion?error=link_expired`);
}
