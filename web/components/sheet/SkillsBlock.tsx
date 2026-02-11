import type {
  AbilityScoreName,
  CharacterSheet,
  CharacterSkill,
} from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";
import { skillRules } from "@/lib/data/tormenta20";

interface SkillsBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

const SKILL_TRAINED_BONUS = 2;

const abilityLabels: Record<AbilityScoreName, string> = {
  forca: "For",
  destreza: "Des",
  constituicao: "Con",
  inteligencia: "Int",
  sabedoria: "Sab",
  carisma: "Car",
};

export function SkillsBlock({ sheet, onChange }: SkillsBlockProps) {
  const { atributos } = sheet;

  const byId = new Map<string, CharacterSkill>();
  for (const skill of sheet.pericias) {
    byId.set(skill.id, skill);
  }

  function upsertSkill(nextSkill: CharacterSkill) {
    const existingIndex = sheet.pericias.findIndex(
      (s) => s.id === nextSkill.id,
    );
    const nextPericias =
      existingIndex >= 0
        ? sheet.pericias.map((s, idx) => (idx === existingIndex ? nextSkill : s))
        : [...sheet.pericias, nextSkill];

    onChange({
      ...sheet,
      pericias: nextPericias,
    });
  }

  function handleChange(
    id: string,
    partial: Partial<CharacterSkill>,
  ): void {
    const baseRule = skillRules.find((rule) => rule.id === id)!;
    const current =
      byId.get(id) ??
      ({
        id,
        atributoUsado: baseRule.atributoPadrao,
        bonusOutros: 0,
        treinada: false,
      } as CharacterSkill);

    const next: CharacterSkill = {
      ...current,
      ...partial,
    };

    upsertSkill(next);
  }

  function getSkillTotal(skillId: string): number {
    const rule = skillRules.find((s) => s.id === skillId);
    if (!rule) return 0;

    const config =
      byId.get(skillId) ??
      ({
        id: skillId,
        atributoUsado: rule.atributoPadrao,
        bonusOutros: 0,
        treinada: false,
      } as CharacterSkill);

    const attr = config.atributoUsado;
    const modAtributo = abilityModifier(atributos[attr]);
    const bonusTreinado = config.treinada ? SKILL_TRAINED_BONUS : 0;

    return modAtributo + bonusTreinado + config.bonusOutros;
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Perícias</h2>
      <p className="text-xs text-zinc-600">
        Cada perícia usa um atributo base (padrão de Tormenta 20), mas você
        pode alterar o atributo usado e adicionar bônus extras quando precisar.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-2 py-1 text-left font-medium text-zinc-700">
                Total
              </th>
              <th className="px-2 py-1 text-left font-medium text-zinc-700">
                Treinada
              </th>
              <th className="px-2 py-1 text-left font-medium text-zinc-700">
                Perícia
              </th>
              <th className="px-2 py-1 text-left font-medium text-zinc-700">
                Atributo
              </th>
              <th className="px-2 py-1 text-left font-medium text-zinc-700">
                Bônus outros
              </th>
            </tr>
          </thead>
          <tbody>
            {skillRules.map((rule) => {
              const current =
                byId.get(rule.id) ??
                ({
                  id: rule.id,
                  atributoUsado: rule.atributoPadrao,
                  bonusOutros: 0,
                  treinada: false,
                } as CharacterSkill);

              const total = getSkillTotal(rule.id);
              const totalLabel = total >= 0 ? `+${total}` : total.toString();

              return (
                <tr
                  key={rule.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50"
                >
                  <td className="px-2 py-1 align-middle font-semibold text-zinc-900">
                    {totalLabel}
                  </td>
                  <td className="px-2 py-1 align-middle">
                    <input
                      type="checkbox"
                      checked={current.treinada}
                      onChange={(event) =>
                        handleChange(rule.id, {
                          treinada: event.target.checked,
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1 align-middle text-zinc-800">
                    {rule.nome}
                  </td>
                  <td className="px-2 py-1 align-middle">
                    <select
                      value={current.atributoUsado}
                      onChange={(event) =>
                        handleChange(rule.id, {
                          atributoUsado: event.target
                            .value as AbilityScoreName,
                        })
                      }
                      className="rounded border border-zinc-300 bg-white px-1 py-0.5 text-[11px] shadow-sm focus:border-zinc-600 focus:outline-none"
                    >
                      {(Object.keys(
                        abilityLabels,
                      ) as AbilityScoreName[]).map((key) => (
                        <option key={key} value={key}>
                          {abilityLabels[key]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1 align-middle">
                    <input
                      type="number"
                      className="w-16 rounded border border-zinc-300 px-1 py-0.5 text-[11px] shadow-sm focus:border-zinc-600 focus:outline-none"
                      value={current.bonusOutros}
                      onChange={(event) =>
                        handleChange(rule.id, {
                          bonusOutros: Number(event.target.value) || 0,
                        })
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

