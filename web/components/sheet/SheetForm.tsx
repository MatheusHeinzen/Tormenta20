'use client';

import { useState } from "react";
import type { CharacterSheet } from "@/lib/models/character";
import { SheetHeader } from "@/components/sheet/SheetHeader";
import { ClassListBlock } from "@/components/sheet/ClassListBlock";
import { AttributesGrid } from "@/components/sheet/AttributesGrid";
import { CombatBlock } from "@/components/sheet/CombatBlock";
import { SkillsBlock } from "@/components/sheet/SkillsBlock";
import { InventoryBlock } from "@/components/sheet/InventoryBlock";
import { NotesBlock } from "@/components/sheet/NotesBlock";
import { SpellsBlock } from "@/components/sheet/SpellsBlock";

interface SheetFormProps {
  initialSheet: CharacterSheet;
  onSubmit(sheet: CharacterSheet): void;
  submitLabel?: string;
}

export function SheetForm({
  initialSheet,
  onSubmit,
  submitLabel = "Salvar ficha",
}: SheetFormProps) {
  const [sheet, setSheet] = useState<CharacterSheet>(initialSheet);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(sheet);
  }

  function handleSheetChange(next: CharacterSheet) {
    setSheet(next);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SheetHeader sheet={sheet} onChange={handleSheetChange} />
      <ClassListBlock sheet={sheet} onChange={handleSheetChange} />
      <AttributesGrid sheet={sheet} onChange={handleSheetChange} />
      <SkillsBlock sheet={sheet} onChange={handleSheetChange} />
      <CombatBlock sheet={sheet} onChange={handleSheetChange} />
      <InventoryBlock sheet={sheet} onChange={handleSheetChange} />
      <SpellsBlock sheet={sheet} onChange={handleSheetChange} />
      <NotesBlock sheet={sheet} onChange={handleSheetChange} />

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

