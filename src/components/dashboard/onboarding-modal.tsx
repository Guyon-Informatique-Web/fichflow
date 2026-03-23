"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, FileDown, ArrowRight, Check } from "lucide-react";

const STORAGE_KEY = "fichflow_onboarding_done";

const STEPS = [
  {
    icon: Camera,
    color: "bg-blue-500/10 text-blue-500",
    title: "Uploadez une photo",
    description:
      "Prenez une photo nette de votre produit — fond neutre de préférence. Une seule photo suffit, plusieurs donnent de meilleurs résultats.",
  },
  {
    icon: Sparkles,
    color: "bg-purple-500/10 text-purple-500",
    title: "Choisissez votre ton",
    description:
      "Professionnel, décontracté, sensuel ou luxe. L'IA adapte le style de la description à votre marque.",
  },
  {
    icon: FileDown,
    color: "bg-green-500/10 text-green-500",
    title: "Récupérez votre fiche",
    description:
      "En quelques secondes, votre fiche produit est prête. Modifiez-la si besoin, puis exportez-la en PDF.",
  },
];

export function OnboardingModal({ isNewUser }: { isNewUser: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isNewUser) return;
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setOpen(true);
  }, [isNewUser]);

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  function handleStart() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    router.push("/produits/nouveau");
  }

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl">Bienvenue sur FichFlow 👋</DialogTitle>
        </DialogHeader>

        {/* Indicateur de progression */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Étape */}
        <div className="py-4 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${current.color}`}>
            <current.icon className="h-8 w-8" />
          </div>
          <p className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Étape {step + 1} sur {STEPS.length}
          </p>
          <h3 className="mb-2 text-lg font-semibold">{current.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
              Précédent
            </Button>
          )}
          {!isLast ? (
            <Button onClick={() => setStep(s => s + 1)} className="flex-1">
              Suivant <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleStart} className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              Créer ma première fiche
            </Button>
          )}
        </div>

        <button
          onClick={handleClose}
          className="text-xs text-muted-foreground hover:text-foreground text-center w-full"
        >
          Passer l&apos;introduction
        </button>
      </DialogContent>
    </Dialog>
  );
}
