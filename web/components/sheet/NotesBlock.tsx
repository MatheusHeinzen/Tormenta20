import type { CharacterSheet } from "@/lib/models/character";

interface NotesBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

export function NotesBlock({ sheet, onChange }: NotesBlockProps) {
  function updateNotas(partial: Partial<CharacterSheet["notas"]>) {
    onChange({
      ...sheet,
      notas: {
        ...sheet.notas,
        ...partial,
      },
    });
  }

  function updateHabilidades(
    partial: Partial<CharacterSheet["habilidades"]>,
  ): void {
    onChange({
      ...sheet,
      habilidades: {
        ...sheet.habilidades,
        ...partial,
      },
    });
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Anotações</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Descrição
          </label>
          <textarea
            rows={4}
            value={sheet.notas.descricao}
            onChange={(event) =>
              updateNotas({ descricao: event.target.value })
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Histórico, aliados, tesouros
          </label>
          <textarea
            rows={4}
            value={sheet.notas.historicoAliadosTesouros}
            onChange={(event) =>
              updateNotas({ historicoAliadosTesouros: event.target.value })
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-zinc-700">
          Anotações gerais
        </label>
        <textarea
          rows={4}
          value={sheet.notas.anotacoesGerais}
          onChange={(event) =>
            updateNotas({ anotacoesGerais: event.target.value })
          }
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Habilidades de raça e origem
          </label>
          <textarea
            rows={4}
            value={sheet.habilidades.habilidadesRacaOrigem}
            onChange={(event) =>
              updateHabilidades({
                habilidadesRacaOrigem: event.target.value,
              })
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Habilidades de classe e poderes
          </label>
          <textarea
            rows={4}
            value={sheet.habilidades.habilidadesClassePoderes}
            onChange={(event) =>
              updateHabilidades({
                habilidadesClassePoderes: event.target.value,
              })
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}

