'use client';

import Link from "next/link";
import { useSheetContext } from "@/context/SheetContext";
import { getRaceDataByName, getTipoCriaturaLabel } from "@/lib/t20/race";

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
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
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
              className="rounded border border-border bg-paper-card px-3 py-1.5 text-xs font-medium text-ink shadow-sm hover:bg-paper"
            >
              Voltar ao menu
            </Link>
            <Link
              href="/sheets/new"
              className="rounded bg-accent px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-90"
            >
              Nova ficha
            </Link>
          </div>
        </header>

        {characters.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Nenhuma ficha encontrada. Clique em &quot;Nova ficha&quot; para
            começar.
          </p>
        ) : (
          <ul className="space-y-3">
            {characters.map((sheet) => (
              <li
                key={sheet.id}
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-paper-card p-4 shadow-sm"
              >
                <div className="space-y-1">
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
                    className="rounded border border-border bg-paper-card px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper"
                  >
                    Usar
                  </Link>
                  <Link
                    href={`/sheets/${sheet.id}/edit`}
                    className="rounded border border-border bg-paper-card px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(sheet.id)}
                    className="rounded border border-red-300 bg-paper-card px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Apagar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

