"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur non gérée:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Une erreur est survenue</h1>
        <p className="text-muted-foreground">
          Quelque chose s&apos;est mal passé. Réessayez ou revenez plus tard.
        </p>
      </div>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
