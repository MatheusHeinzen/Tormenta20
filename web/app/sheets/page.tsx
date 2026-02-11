'use client';

import Link from "next/link";
import { useSheetContext } from "@/context/SheetContext";

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Fichas salvas
            </h1>
            <p className="text-xs text-zinc-600">
              As fichas abaixo estão salvas apenas neste navegador.
            </p>
          </div>

          <Link
            href="/sheets/new"
            className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-zinc-800"
          >
            Nova ficha
          </Link>
        </header>

        {characters.length === 0 ? (
          <p className="text-sm text-zinc-600">
            Nenhuma ficha encontrada. Clique em &quot;Nova ficha&quot; para
            começar.
          </p>
        ) : (
          <ul className="space-y-3">
            {characters.map((sheet) => (
              <li
                key={sheet.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-zinc-900">
                      {sheet.nome || "Sem nome"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {sheet.raca} • {sheet.origem} • {getClassesResumo(sheet)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Atualizado em{" "}
                    {new Date(sheet.updatedAt).toLocaleString("pt-BR")}
                  </p>
                </div>

                <div className="flex flex-shrink-0 gap-2">
                  <Link
                    href={`/sheets/${sheet.id}/play`}
                    className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                  >
                    Usar
                  </Link>
                  <Link
                    href={`/sheets/${sheet.id}/edit`}
                    className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(sheet.id)}
                    className="rounded border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
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

