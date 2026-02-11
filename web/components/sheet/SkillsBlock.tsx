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

  const midIndex = Math.ceil(skillRules.length / 2);
  const leftSkills = skillRules.slice(0, midIndex);
  const rightSkills = skillRules.slice(midIndex);

  function renderRows(rules: typeof skillRules) {
    return rules.map((rule) => {
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
          <td className="px-1 py-0.5 align-middle font-semibold text-zinc-900">
            {totalLabel}
          </td>
          <td className="px-1 py-0.5 align-middle">
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
          <td className="px-1 py-0.5 align-middle text-zinc-800">
            {rule.nome}
          </td>
          <td className="px-1 py-0.5 align-middle">
            <select
              value={current.atributoUsado}
              onChange={(event) =>
                handleChange(rule.id, {
                  atributoUsado: event.target.value as AbilityScoreName,
                })
              }
              className="rounded border border-zinc-300 bg-white px-1 py-0.5 text-[10px] shadow-sm focus:border-zinc-600 focus:outline-none"
            >
              {(Object.keys(abilityLabels) as AbilityScoreName[]).map((key) => (
                <option key={key} value={key}>
                  {abilityLabels[key]}
                </option>
              ))}
            </select>
          </td>
          <td className="px-1 py-0.5 align-middle">
            <input
              type="number"
              className="w-14 rounded border border-zinc-300 px-1 py-0.5 text-[10px] shadow-sm focus:border-zinc-600 focus:outline-none"
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
    });
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900">Perícias</h2>
      <p className="text-xs text-zinc-600">
        Use o atributo sugerido ou ajuste conforme a mesa. O total já inclui
        modificador de atributo, treinamento (+2) e bônus extras.
      </p>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  Tot
                </th>
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  T
                </th>
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  Perícia
                </th>
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  Atr
                </th>
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  B.
                </th>
              </tr>
            </thead>
            <tbody>{renderRows(leftSkills)}</tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  Tot
                </th>
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  T
                </th>
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  Perícia
                </th>
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  Atr
                </th>
                <th className="px-1 py-1 text-left font-semibold text-zinc-600">
                  B.
                </th>
              </tr>
            </thead>
            <tbody>{renderRows(rightSkills)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

