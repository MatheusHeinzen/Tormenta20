import type { CharacterSheet } from "@/lib/models/character";
import {
  getDeuses,
  getOrigens,
  getRacas,
} from "@/lib/data/tormenta20";

interface SheetHeaderProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

export function SheetHeader({ sheet, onChange }: SheetHeaderProps) {
  const nivelTotal =
    sheet.classes.length > 0
      ? sheet.classes.reduce((total, klass) => total + klass.nivel, 0)
      : sheet.nivel;

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
    <section className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900">
        Identificação da ficha
      </h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-500">
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
          <label className="block text-xs font-semibold text-zinc-500">
            Raça
          </label>
          <select
            value={sheet.raca}
            onChange={(event) => handleFieldChange("raca", event.target.value)}
            className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          >
            <option value="">Selecione uma raça</option>
            {getRacas().map((race) => (
              <option key={race.id} value={race.nome}>
                {race.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-500">
            Origem
          </label>
          <select
            value={sheet.origem}
            onChange={(event) =>
              handleFieldChange("origem", event.target.value)
            }
            className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          >
            <option value="">Selecione uma origem</option>
            {getOrigens().map((origin) => (
              <option key={origin.id} value={origin.nome}>
                {origin.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-500">
            Divindade
          </label>
          <select
            value={sheet.divindade}
            onChange={(event) =>
              handleFieldChange("divindade", event.target.value)
            }
            className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          >
            <option value="">Selecione uma divindade</option>
            {getDeuses().map((god) => (
              <option key={god.id} value={god.nome}>
                {god.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-zinc-500">Classe e nível</p>
          <p className="text-sm font-medium text-zinc-800">
            {sheet.classes.length > 0
              ? sheet.classes
                  .map((klass) => `${klass.nome} ${klass.nivel}`)
                  .join(" / ")
              : sheet.classePrincipal
                ? `${sheet.classePrincipal} ${sheet.nivel}`
                : "—"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-zinc-500">Nível total</p>
          <p className="text-sm font-medium text-zinc-800">{nivelTotal}</p>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-500">
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
          <label className="block text-xs font-semibold uppercase text-zinc-500">
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

