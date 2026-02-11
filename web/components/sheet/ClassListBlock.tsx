import type { CharacterClass, CharacterSheet } from "@/lib/models/character";
import { getClasses } from "@/lib/data/tormenta20";

interface ClassListBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

export function ClassListBlock({ sheet, onChange }: ClassListBlockProps) {
  const classes = sheet.classes;

  function updateClasses(next: CharacterClass[]) {
    onChange({
      ...sheet,
      classes: next,
    });
  }

  function handleChange(index: number, partial: Partial<CharacterClass>) {
    const next = classes.map((klass, idx) =>
      idx === index ? { ...klass, ...partial } : klass,
    );
    updateClasses(next);
  }

  function handleAdd() {
    const baseName = getClasses()[0]?.nome ?? "Nova classe";
    const nova: CharacterClass = {
      id: crypto.randomUUID(),
      nome: baseName,
      nivel: 1,
    };
    updateClasses([...classes, nova]);
  }

  function handleRemove(index: number) {
    const next = classes.filter((_, idx) => idx !== index);
    updateClasses(next);
  }

  const allClassOptions = getClasses();

  return (
    <section className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900">Classes</h2>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
        >
          Adicionar classe
        </button>
      </div>

      {classes.length === 0 ? (
        <p className="text-sm text-zinc-600">
          Nenhuma classe adicionada. Use &quot;Adicionar classe&quot; para
          começar.
        </p>
      ) : (
        <div className="space-y-3">
          {classes.map((klass, index) => (
            <details
              key={klass.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
              open={index === 0}
            >
              <summary className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex flex-1 items-center gap-2">
                  <select
                    value={klass.nome}
                    onChange={(event) =>
                      handleChange(index, { nome: event.target.value })
                    }
                    className="max-w-[180px] rounded border border-zinc-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                  >
                    {allClassOptions.map((option) => (
                      <option key={option.id} value={option.nome}>
                        {option.nome}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs font-semibold text-zinc-500">
                    Nível
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={klass.nivel}
                    onChange={(event) =>
                      handleChange(index, {
                        nivel: Number(event.target.value) || 1,
                      })
                    }
                    className="w-16 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    handleRemove(index);
                  }}
                  className="rounded border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  Remover
                </button>
              </summary>

              <div className="mt-3 space-y-2 text-xs text-zinc-600">
                <p>
                  Espaço reservado para detalhes da classe (HP por nível, PM,
                  poderes). Por enquanto, use as anotações gerais para registrar
                  informações extras.
                </p>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

