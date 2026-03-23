"use server";

import { createClient } from "@/lib/supabase/server";

type ActionResult = { error?: string };

export async function forgotPasswordAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email requis." };
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fichflow.vercel.app";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Supabase appelle ce callback avec ?code=xxx&type=recovery
    redirectTo: `${appUrl}/api/auth/callback?type=recovery`,
  });

  if (error) {
    console.error("Reset password error:", error.message);
    // Ne pas révéler si l'email existe ou non — toujours retourner succès
  }

  return {};
}
