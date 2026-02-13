 'use client';

import { useState } from "react";
import type { AbilityScoreName, CharacterSheet } from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";
import { AttributesCalculatorModal } from "@/components/sheet/AttributesCalculatorModal";

interface AttributesGridProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

const LABELS: Record<AbilityScoreName, string> = {
  forca: "Força",
  destreza: "Destreza",
  constituicao: "Constituição",
  inteligencia: "Inteligência",
  sabedoria: "Sabedoria",
  carisma: "Carisma",
};

export function AttributesGrid({ sheet, onChange }: AttributesGridProps) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  function handleApplyFromCalculator(next: CharacterSheet) {
    onChange(next);
  }

  return (
    <section className="space-y-5 rounded-md border border-border bg-paper-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold text-ink">Atributos</h2>
        <button
          type="button"
          className="rounded border border-border bg-paper-card px-3 py-1 text-xs font-medium text-ink shadow-sm hover:bg-paper"
          onClick={() => setIsCalculatorOpen(true)}
        >
          Abrir calculadora de atributos
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(LABELS) as AbilityScoreName[]).map((key) => {
          const score = sheet.atributos[key];
          const mod = abilityModifier(score);

          return (
            <div
              key={key}
              className="flex flex-col items-center justify-between rounded-md border border-border bg-paper p-3 text-center"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                {LABELS[key]}
              </span>
              <span className="mt-2 text-lg font-semibold tabular-nums text-ink">
                {mod >= 0 ? `+${mod}` : mod.toString()}
              </span>
            </div>
          );
        })}
      </div>

      <AttributesCalculatorModal
        open={isCalculatorOpen}
        sheet={sheet}
        onOpenChange={setIsCalculatorOpen}
        onApply={handleApplyFromCalculator}
      />
    </section>
  );
}

