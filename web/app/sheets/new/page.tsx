'use client';

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { SheetForm } from "@/components/sheet/SheetForm";
import { useSheetContext } from "@/context/SheetContext";
import { createEmptyCharacterSheet } from "@/lib/models/character";
import type { CharacterSheet } from "@/lib/models/character";

export default function NewSheetPage() {
  const router = useRouter();
  const { updateCharacter } = useSheetContext();

  const emptySheet = useMemo(
    () => createEmptyCharacterSheet("Novo personagem"),
    [],
  );

  function handleSubmit(sheet: CharacterSheet) {
    const saved = updateCharacter(sheet);
    router.push(`/sheets/${saved.id}/edit`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Nova ficha de personagem
          </h1>
          <p className="text-xs text-zinc-600">
            Campos inspirados na ficha automática oficial de Tormenta 20.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-2 inline-flex items-center rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
          >
            Voltar ao menu
          </button>
        </header>

        <SheetForm
          initialSheet={emptySheet}
          onSubmit={handleSubmit}
          submitLabel="Criar ficha"
        />
      </div>
    </main>
  );
}

