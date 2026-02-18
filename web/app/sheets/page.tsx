'use client';

import Link from "next/link";
import { useSheetContext } from "@/context/SheetContext";
import { getRaceDataByName, getTipoCriaturaLabel } from "@/lib/t20/race";
import { AdBanner } from "@/components/ads/AdBanner";
import { AdSidebar } from "@/components/ads/AdSidebar";

export default function SheetsListPage() {
  const { characters, deleteCharacter } = useSheetContext();

  function getClassesResumo(sheet: ReturnType<typeof useSheetContext>["characters"][number]): string {
    if (sheet.classes && sheet.classes.length > 0) {
      return sheet.classes.map((klass) => `${klass.nome} ${klass.nivel}`).join(" / ");
    }

    if (sheet.classePrincipal) {
      return `${sheet.classePrincipal} ${sheet.nivel}`;
    }

    return "Sem classe";
  }

  function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja apagar esta ficha? Essa ação não pode ser desfeita.",
    );
    if (!confirmDelete) {
      return;
    }
    deleteCharacter(id);
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-ink">
              Fichas salvas
            </h1>
            <p className="text-xs text-ink-muted">
              As fichas abaixo estão salvas apenas neste navegador.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="flex min-h-[44px] items-center justify-center rounded border border-border bg-paper-card px-4 text-xs font-medium text-ink shadow-sm hover:bg-paper"
            >
              Voltar ao menu
            </Link>
            <Link
              href="/sheets/new"
              className="flex min-h-[44px] items-center justify-center rounded bg-accent px-4 text-xs font-medium text-white shadow-sm hover:opacity-90"
            >
              Nova ficha
            </Link>
          </div>
        </header>

        {/* Layout com sidebar em telas grandes */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          {/* Conteúdo principal */}
          <div className="min-w-0">
            {/* Ad banner após o header (apenas em mobile) */}
            <div className="mb-6 lg:hidden">
              <AdBanner position="top" />
            </div>

            {characters.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Nenhuma ficha encontrada. Clique em &quot;Nova ficha&quot; para
                começar.
              </p>
            ) : (
              <ul className="space-y-3">
                {characters.map((sheet, index) => (
                  <li key={sheet.id}>
                    {/* Ad banner a cada 3 fichas (apenas em mobile) */}
                    {index > 0 && index % 3 === 0 && (
                      <div className="my-6 lg:hidden">
                        <AdBanner position="middle" />
                      </div>
                    )}
                    <div className="flex flex-col gap-3 rounded-md border border-border bg-paper-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-semibold text-ink">
                            {sheet.nome || "Sem nome"}
                          </span>
                          <span className="text-xs text-ink-muted">
                            {sheet.raca} • {sheet.origem} • Tipo: {getTipoCriaturaLabel(getRaceDataByName(sheet.raca)?.tipo_criatura)} • {getClassesResumo(sheet)}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted">
                          Atualizado em{" "}
                          {new Date(sheet.updatedAt).toLocaleString("pt-BR")}
                        </p>
                      </div>

                      <div className="flex flex-shrink-0 gap-2">
                        <Link
                          href={`/sheets/${sheet.id}/play`}
                          className="flex min-h-[44px] flex-1 items-center justify-center rounded border border-border bg-paper-card px-4 text-xs font-medium text-ink hover:bg-paper sm:flex-initial"
                        >
                          Usar
                        </Link>
                        <Link
                          href={`/sheets/${sheet.id}/edit`}
                          className="flex min-h-[44px] flex-1 items-center justify-center rounded border border-border bg-paper-card px-4 text-xs font-medium text-ink hover:bg-paper sm:flex-initial"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(sheet.id)}
                          className="flex min-h-[44px] flex-1 items-center justify-center rounded border border-red-300 bg-paper-card px-4 text-xs font-medium text-red-700 hover:bg-red-50 sm:flex-initial"
                        >
                          Apagar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Ad banner antes do final da página (apenas em mobile) */}
            {characters.length > 0 && (
              <div className="mt-6 lg:hidden">
                <AdBanner position="bottom" />
              </div>
            )}
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

