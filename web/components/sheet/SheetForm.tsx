'use client';

import { useState } from "react";
import type { CharacterSheet } from "@/lib/models/character";
import { applyT20DerivedChanges } from "@/lib/t20/derived";
import { SheetHeader } from "@/components/sheet/SheetHeader";
import { SheetTabs } from "@/components/sheet/SheetTabs";
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
  const [activeTab, setActiveTab] = useState("basico");

  const tabs = [
    { id: "basico", label: "Básico" },
    { id: "combate", label: "Combate" },
    { id: "pericias", label: "Perícias" },
    { id: "inventario", label: "Inventário" },
    { id: "magias", label: "Magias" },
    { id: "anotacoes", label: "Anotações" },
  ];

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(sheet);
  }

  function handleSheetChange(next: CharacterSheet) {
    setSheet((prev) => applyT20DerivedChanges(prev, next));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SheetTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "basico" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
            <ClassListBlock sheet={sheet} onChange={handleSheetChange} />
            <SheetHeader sheet={sheet} onChange={handleSheetChange} />
          </div>
          <AttributesGrid sheet={sheet} onChange={handleSheetChange} />
        </div>
      )}

      {activeTab === "combate" && (
        <CombatBlock sheet={sheet} onChange={handleSheetChange} />
      )}

      {activeTab === "pericias" && (
        <SkillsBlock sheet={sheet} onChange={handleSheetChange} />
      )}

      {activeTab === "inventario" && (
        <InventoryBlock sheet={sheet} onChange={handleSheetChange} />
      )}

      {activeTab === "magias" && (
        <SpellsBlock sheet={sheet} onChange={handleSheetChange} />
      )}

      {activeTab === "anotacoes" && (
        <NotesBlock sheet={sheet} onChange={handleSheetChange} />
      )}

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

