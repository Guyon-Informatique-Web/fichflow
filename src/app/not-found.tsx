import Link from "next/link";
import { FileQuestion, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Page introuvable</h1>
        <p className="text-muted-foreground">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Page d&apos;accueil</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/inscription">
            Créer un compte <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Besoin d&apos;aide ? Contactez-nous à{" "}
        <a href="mailto:contact@guyon-informatique-web.fr" className="text-primary underline">
          contact@guyon-informatique-web.fr
        </a>
      </p>
    </div>
  );
}
