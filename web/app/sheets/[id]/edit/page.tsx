'use client';

import { useRouter, useParams } from "next/navigation";
import { SheetForm } from "@/components/sheet/SheetForm";
import { useSheetContext } from "@/context/SheetContext";
import type { CharacterSheet } from "@/lib/models/character";

export default function EditSheetPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { characters, updateCharacter, loading } = useSheetContext();

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-zinc-600">Carregando ficha...</p>
      </main>
    );
  }

  const initial = characters.find((character) => character.id === params.id);

  if (!initial) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-zinc-600">
          Ficha não encontrada. Volte para a lista de fichas.
        </p>
      </main>
    );
  }

  function handleSubmit(sheet: CharacterSheet) {
    const saved = updateCharacter(sheet);
    router.push(`/sheets/${saved.id}/play`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Editar ficha – {initial.nome}
          </h1>
          <p className="text-xs text-zinc-600">
            Ajuste os campos da sua ficha. As mudanças são salvas neste navegador.
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
          initialSheet={initial}
          onSubmit={handleSubmit}
          submitLabel="Salvar alterações"
        />
      </div>
    </main>
  );
}


