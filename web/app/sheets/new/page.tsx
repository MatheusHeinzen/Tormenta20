'use client';

import { useRouter } from "next/navigation";
import { SheetForm } from "@/components/sheet/SheetForm";
import { useSheetContext } from "@/context/SheetContext";
import { createEmptyCharacterSheet } from "@/lib/models/character";

export default function NewSheetPage() {
  const router = useRouter();
  const { createCharacter } = useSheetContext();

  const emptySheet = createEmptyCharacterSheet("Novo personagem");

  function handleSubmit(sheet: typeof emptySheet) {
    const created = createCharacter(sheet.nome || "Novo personagem");
    router.push(`/sheets/${created.id}/edit`);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Nova ficha de personagem
        </h1>
        <p className="text-xs text-zinc-600">
          Campos inspirados na ficha automática oficial de Tormenta 20.
        </p>
      </header>

      <SheetForm
        initialSheet={emptySheet}
        onSubmit={handleSubmit}
        submitLabel="Criar ficha"
      />
    </main>
  );
}

