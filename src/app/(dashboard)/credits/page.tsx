import type { Metadata } from "next";
import { getAuthUser } from "@/lib/auth";
import { CreditsView } from "./credits-view";

export const metadata: Metadata = {
  title: "Crédits",
};

export default async function CreditsPage() {
  const user = await getAuthUser();

  return <CreditsView credits={user.credits} userId={user.id} />;
}
