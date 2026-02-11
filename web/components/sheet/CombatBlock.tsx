import type { CharacterSheet } from "@/lib/models/character";

interface CombatBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

export function CombatBlock({ sheet, onChange }: CombatBlockProps) {
  function handleChange(
    key: keyof CharacterSheet["combate"],
    value: number,
  ): void {
    onChange({
      ...sheet,
      combate: {
        ...sheet.combate,
        [key]: value,
      },
    });
  }

  const combate = sheet.combate;

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Combate</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-md bg-zinc-50 p-3">
          <h3 className="text-sm font-medium text-zinc-800">Pontos de Vida</h3>
          <div className="flex items-center gap-2">
            <label className="flex flex-1 flex-col text-xs text-zinc-600">
              Atual
              <input
                type="number"
                className="mt-1 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                value={combate.pvAtual}
                onChange={(event) =>
                  handleChange("pvAtual", Number(event.target.value) || 0)
                }
              />
            </label>
            <span className="mt-5 text-sm text-zinc-500">/</span>
            <label className="flex flex-1 flex-col text-xs text-zinc-600">
              Máximo
              <input
                type="number"
                className="mt-1 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                value={combate.pvMaximo}
                onChange={(event) =>
                  handleChange("pvMaximo", Number(event.target.value) || 0)
                }
              />
            </label>
          </div>
        </div>

        <div className="space-y-2 rounded-md bg-zinc-50 p-3">
          <h3 className="text-sm font-medium text-zinc-800">Pontos de Mana</h3>
          <div className="flex items-center gap-2">
            <label className="flex flex-1 flex-col text-xs text-zinc-600">
              Atual
              <input
                type="number"
                className="mt-1 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                value={combate.pmAtual}
                onChange={(event) =>
                  handleChange("pmAtual", Number(event.target.value) || 0)
                }
              />
            </label>
            <span className="mt-5 text-sm text-zinc-500">/</span>
            <label className="flex flex-1 flex-col text-xs text-zinc-600">
              Máximo
              <input
                type="number"
                className="mt-1 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                value={combate.pmMaximo}
                onChange={(event) =>
                  handleChange("pmMaximo", Number(event.target.value) || 0)
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Classe de Armadura (CA)
          </label>
          <input
            type="number"
            className="w-full rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
            value={combate.caTotal}
            onChange={(event) =>
              handleChange("caTotal", Number(event.target.value) || 0)
            }
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Penalidade de armadura
          </label>
          <input
            type="number"
            className="w-full rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
            value={combate.penalidadeArmadura}
            onChange={(event) =>
              handleChange(
                "penalidadeArmadura",
                Number(event.target.value) || 0,
              )
            }
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Deslocamento (m)
          </label>
          <input
            type="number"
            className="w-full rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
            value={combate.deslocamento}
            onChange={(event) =>
              handleChange("deslocamento", Number(event.target.value) || 0)
            }
          />
        </div>
      </div>
    </section>
  );
}

