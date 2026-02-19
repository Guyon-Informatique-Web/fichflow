"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { FREE_CREDITS } from "@/lib/constants";
import { redirect } from "next/navigation";

// Résultat d'une action auth
type AuthResult = {
  error?: string;
};

// Connexion par email/mot de passe
export async function loginAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email ou mot de passe incorrect." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Veuillez confirmer votre email avant de vous connecter." };
    }
    return { error: "Erreur de connexion. Réessayez." };
  }

  // Sync utilisateur Prisma (création si premier login)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email! },
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name ?? null,
        credits: FREE_CREDITS,
      },
    });
  }

  redirect("/dashboard");
}

// Inscription par email/mot de passe
export async function signupAction(formData: FormData): Promise<AuthResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Tous les champs sont requis." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Un compte existe déjà avec cet email." };
    }
    return { error: "Erreur lors de l'inscription. Réessayez." };
  }

  // Créer l'utilisateur Prisma avec les crédits gratuits
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email!,
        name,
        credits: FREE_CREDITS,
      },
    });

    // Enregistrer la transaction de bonus
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        type: "BONUS",
        amount: FREE_CREDITS,
        description: "Crédits offerts à l'inscription",
      },
    });
  }

  redirect("/dashboard");
}

// Déconnexion
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}
