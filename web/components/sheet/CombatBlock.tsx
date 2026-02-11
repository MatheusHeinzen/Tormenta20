import type { AbilityScoreName, CharacterSheet } from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";

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
  const config = sheet.config;

  const atributoHp: AbilityScoreName = config?.derived.atributoHp ?? "constituicao";
  const atributoDefesa: AbilityScoreName =
    config?.derived.atributoDefesa ?? "destreza";

  const atributoHpValor = sheet.atributos[atributoHp];
  const atributoDefesaValor = sheet.atributos[atributoDefesa];

  const atributoHpMod = abilityModifier(atributoHpValor);
  const atributoDefesaMod = abilityModifier(atributoDefesaValor);

  function handleConfigChange(
    key: keyof typeof config.derived,
    value: AbilityScoreName,
  ) {
    const nextConfig = {
      ...config,
      derived: {
        ...config.derived,
        [key]: value,
      },
    };

    onChange({
      ...sheet,
      config: nextConfig,
    });
  }

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
              <span className="mt-1 text-[11px] text-zinc-600">
                Mod. de atributo para HP:{" "}
                <strong>
                  {atributoHp.toUpperCase()}{" "}
                  {atributoHpMod >= 0 ? `+${atributoHpMod}` : atributoHpMod}
                </strong>
              </span>
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
          <p className="mt-1 text-xs text-zinc-600">
            Mod. de atributo na Defesa:{" "}
            <strong>
              {atributoDefesa.toUpperCase()}{" "}
              {atributoDefesaMod >= 0 ? `+${atributoDefesaMod}` : atributoDefesaMod}
            </strong>
          </p>
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Atributo usado para HP
          </label>
          <select
            value={atributoHp}
            onChange={(event) =>
              handleConfigChange(
                "atributoHp",
                event.target.value as AbilityScoreName,
              )
            }
            className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          >
            <option value="forca">Força</option>
            <option value="destreza">Destreza</option>
            <option value="constituicao">Constituição</option>
            <option value="inteligencia">Inteligência</option>
            <option value="sabedoria">Sabedoria</option>
            <option value="carisma">Carisma</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700">
            Atributo usado para Defesa
          </label>
          <select
            value={atributoDefesa}
            onChange={(event) =>
              handleConfigChange(
                "atributoDefesa",
                event.target.value as AbilityScoreName,
              )
            }
            className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
          >
            <option value="forca">Força</option>
            <option value="destreza">Destreza</option>
            <option value="constituicao">Constituição</option>
            <option value="inteligencia">Inteligência</option>
            <option value="sabedoria">Sabedoria</option>
            <option value="carisma">Carisma</option>
          </select>
        </div>
      </div>
    </section>
  );
}

