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
    <section className="space-y-5 rounded-md border border-border bg-paper-card p-5 shadow-sm">
      <h2 className="font-serif text-base font-semibold text-ink">Anotações</h2>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-ink-muted">
            Descrição
          </label>
          <textarea
            rows={3}
            value={sheet.notas.descricao}
            onChange={(event) =>
              updateNotas({ descricao: event.target.value })
            }
            className="w-full rounded border border-border bg-paper-card px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-ink-muted">
            Histórico, aliados, tesouros
          </label>
          <textarea
            rows={3}
            value={sheet.notas.historicoAliadosTesouros}
            onChange={(event) =>
              updateNotas({ historicoAliadosTesouros: event.target.value })
            }
            className="w-full rounded border border-border bg-paper-card px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-ink-muted">
            Anotações gerais
          </label>
          <textarea
            rows={3}
            value={sheet.notas.anotacoesGerais}
            onChange={(event) =>
              updateNotas({ anotacoesGerais: event.target.value })
            }
            className="w-full rounded border border-border bg-paper-card px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-ink-muted">
            Habilidades de raça e origem
          </label>
          <textarea
            rows={3}
            value={sheet.habilidades.habilidadesRacaOrigem}
            onChange={(event) =>
              updateHabilidades({
                habilidadesRacaOrigem: event.target.value,
              })
            }
            className="w-full rounded border border-border bg-paper-card px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-ink-muted">
            Habilidades de classe e poderes
          </label>
          <textarea
            rows={3}
            value={sheet.habilidades.habilidadesClassePoderes}
            onChange={(event) =>
              updateHabilidades({
                habilidadesClassePoderes: event.target.value,
              })
            }
            className="w-full rounded border border-border bg-paper-card px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}

