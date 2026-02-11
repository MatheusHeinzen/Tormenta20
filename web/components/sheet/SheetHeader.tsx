import type { CharacterSheet } from "@/lib/models/character";

interface SheetHeaderProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

export function SheetHeader({ sheet, onChange }: SheetHeaderProps) {
  function handleFieldChange<K extends keyof CharacterSheet>(
    key: K,
    value: CharacterSheet[K],
  ) {
    onChange({
      ...sheet,
      [key]: value,
    });
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">
        Identificação da ficha
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Nome do personagem
          </label>
          <input
            type="text"
            value={sheet.nome}
            onChange={(event) => handleFieldChange("nome", event.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">Raça</label>
          <input
            type="text"
            value={sheet.raca}
            onChange={(event) => handleFieldChange("raca", event.target.value)}
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Origem
          </label>
          <input
            type="text"
            value={sheet.origem}
            onChange={(event) =>
              handleFieldChange("origem", event.target.value)
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Divindade
          </label>
          <input
            type="text"
            value={sheet.divindade}
            onChange={(event) =>
              handleFieldChange("divindade", event.target.value)
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Classe principal
          </label>
          <input
            type="text"
            value={sheet.classePrincipal}
            onChange={(event) =>
              handleFieldChange("classePrincipal", event.target.value)
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Outras classes
          </label>
          <input
            type="text"
            value={sheet.classesSecundarias}
            onChange={(event) =>
              handleFieldChange("classesSecundarias", event.target.value)
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Nível
          </label>
          <input
            type="number"
            min={1}
            value={sheet.nivel}
            onChange={(event) =>
              handleFieldChange("nivel", Number(event.target.value) || 1)
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Tamanho
          </label>
          <input
            type="text"
            value={sheet.tamanho}
            onChange={(event) =>
              handleFieldChange("tamanho", event.target.value)
            }
            className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-xs font-medium uppercase text-zinc-500">
            Sistema
          </label>
          <input
            type="text"
            value={sheet.sistema}
            readOnly
            className="w-full cursor-not-allowed rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
          />
        </div>
      </div>
    </section>
  );
}

