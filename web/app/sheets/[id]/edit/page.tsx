'use client';

import { useRouter, useParams } from "next/navigation";
import { SheetForm } from "@/components/sheet/SheetForm";
import { useSheetContext } from "@/context/SheetContext";
import type { CharacterSheet } from "@/lib/models/character";
import { AdSidebar } from "@/components/ads/AdSidebar";

export default function EditSheetPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { characters, updateCharacter, loading } = useSheetContext();

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-ink-muted">Carregando ficha...</p>
      </main>
    );
  }

  const initial = characters.find((character) => character.id === params.id);

  if (!initial) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-ink-muted">
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
    <main className="min-h-screen w-full max-w-full overflow-x-hidden px-4 py-8">
      <div className="mx-auto w-full min-w-0 lg:max-w-7xl">
        <header className="mb-6 space-y-1">
          <h1 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
            Editar ficha – {initial.nome}
          </h1>
          <p className="text-xs text-ink-muted">
            Ajuste os campos da sua ficha. As mudanças são salvas neste navegador.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded border border-border bg-paper-card px-4 text-xs font-medium text-ink shadow-sm hover:bg-paper"
          >
            Voltar ao menu
          </button>
        </header>

        {/* Layout com sidebar em telas grandes */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          {/* Conteúdo principal */}
          <div className="min-w-0">
            <SheetForm
              initialSheet={initial}
              onSubmit={handleSubmit}
              submitLabel="Salvar alterações"
            />
          </div>

          {/* Sidebar com anúncios (apenas em telas grandes) */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-6">
              <AdSidebar adUnitId={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_AD_UNIT_ID} />
              {/* Segundo anúncio sidebar (opcional) */}
              <AdSidebar 
                adUnitId={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_AD_UNIT_ID_2}
                className="mt-8"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}


