import type {
  AbilityScoreName,
  CharacterSheet,
  CharacterSkill,
} from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";
import {
  getBonusPericiaPoderesConcedidos,
  getClassByNome,
  getOrigemByNome,
  hasPoderConcedido,
  skillRules,
} from "@/lib/data/tormenta20";

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

function getPericiasFromClasses(sheet: CharacterSheet): {
  base: string[];
  treinaveis: string[];
  slotsClasse: number;
  slotsInteligencia: number;
} {
  const classes = sheet.classes ?? [];
  const baseSet = new Set<string>();
  const treinaveisSet = new Set<string>();
  let slotsClasse = 0;
  let slotsInteligencia = 0;
  for (const klass of classes) {
    const data = getClassByNome(klass.nome);
    if (!data) continue;
    (data.pericias_base ?? []).forEach((id) => baseSet.add(id));
    (data.pericias_treinaveis ?? []).forEach((id) => treinaveisSet.add(id));
    const pt = data.pericias_treinadas;
    if (typeof pt === "number") {
      slotsClasse += pt;
    } else if (typeof pt === "string" && pt.includes("+")) {
      const [fixed, attr] = pt.split("+").map((s) => s.trim().toLowerCase());
      const n = parseInt(fixed, 10) || 0;
      slotsClasse += n;
      if (attr === "inteligencia" && sheet.atributos.inteligencia != null) {
        slotsInteligencia += Math.max(
          0,
          abilityModifier(sheet.atributos.inteligencia),
        );
      }
    }

    if (
      data.id === "arcanista" &&
      klass.caminho === "feiticeiro" &&
      klass.linhagem === "feerica"
    ) {
      baseSet.add("enganacao");
    }
  }
  const origem = getOrigemByNome(sheet.origem);
  (origem?.pericias ?? []).forEach((id) => baseSet.add(id));
  return {
    base: [...baseSet],
    treinaveis: [...treinaveisSet],
    slotsClasse,
    slotsInteligencia,
  };
}

const SLOTS_CONHECIMENTO_ENCICLOPEDICO = 2;

export function SkillsBlock({ sheet, onChange }: SkillsBlockProps) {
  const { atributos } = sheet;
  const {
    base: periciasBaseClasse,
    treinaveis: periciasTreinaveisClasse,
    slotsClasse,
    slotsInteligencia,
  } = getPericiasFromClasses(sheet);
  const skillIdsInRules = new Set(skillRules.map((s) => s.id));
  const baseFiltered = periciasBaseClasse.filter((id) => skillIdsInRules.has(id));
  const treinaveisFiltered = periciasTreinaveisClasse.filter((id) =>
    skillIdsInRules.has(id),
  );
  const idsPoderesConcedidos = [
    ...(sheet.poderesDivindadeIds ?? []),
    ...(sheet.poderConcedidoLinhagemAbencoadaId
      ? [sheet.poderConcedidoLinhagemAbencoadaId]
      : []),
  ];
  const hasConhecimentoEnciclopedico = hasPoderConcedido(
    idsPoderesConcedidos,
    "conhecimento_enciclopedico",
  );
  const slotsCE = hasConhecimentoEnciclopedico
    ? SLOTS_CONHECIMENTO_ENCICLOPEDICO
    : 0;
  const totalSlots = slotsClasse + slotsInteligencia + slotsCE;

  const countTreinadasChosen = sheet.pericias.filter(
    (s) => s.treinada && !baseFiltered.includes(s.id),
  ).length;

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

  function getSkillTotal(skillId: string, effectiveTreinada?: boolean): number {
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
    const treinada = effectiveTreinada ?? config.treinada;
    const bonusTreinado = treinada ? SKILL_TRAINED_BONUS : 0;
    const bonusPoderesConcedidos = getBonusPericiaPoderesConcedidos(
      idsPoderesConcedidos,
      skillId,
    );

    return modAtributo + bonusTreinado + config.bonusOutros + bonusPoderesConcedidos;
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

      const isBaseFromClass = baseFiltered.includes(rule.id);
      const effectiveTreinada = current.treinada || isBaseFromClass;
      const total = getSkillTotal(rule.id, effectiveTreinada);
      const totalLabel = total >= 0 ? `+${total}` : total.toString();
      const podeMarcar = countTreinadasChosen < totalSlots;
      const podeDesmarcar = current.treinada && !isBaseFromClass;
      const checkboxDisabled = !podeMarcar && !podeDesmarcar;

      return (
        <tr
          key={rule.id}
          className="border-b border-border hover:bg-paper"
        >
          <td className="px-1 py-0.5 align-middle font-semibold text-ink">
            {totalLabel}
          </td>
          <td className="px-1 py-0.5 align-middle">
            {isBaseFromClass ? (
              <span className="text-[10px] text-ink-muted" title="Perícia base da classe">
                base
              </span>
            ) : (
              <input
                type="checkbox"
                checked={effectiveTreinada}
                disabled={checkboxDisabled}
                onChange={(event) =>
                  handleChange(rule.id, {
                    treinada: event.target.checked,
                  })
                }
              />
            )}
          </td>
          <td className="px-1 py-0.5 align-middle text-ink">
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
              className="rounded border border-border bg-paper-card px-1 py-0.5 text-[10px] shadow-sm focus:border-accent focus:outline-none"
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
              className="w-14 rounded border border-border px-1 py-0.5 text-[10px] shadow-sm focus:border-accent focus:outline-none"
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

  const resumoClasse =
    baseFiltered.length > 0 ||
    treinaveisFiltered.length > 0 ||
    totalSlots > 0 ? (
      <p className="text-xs text-ink-muted">
        {baseFiltered.length > 0 && (
          <>Perícias base (classe e origem): {baseFiltered.map((id) => skillRules.find((s) => s.id === id)?.nome ?? id).join(", ")} (sempre +2). </>
        )}
        {totalSlots > 0 && (
          <>
            Escolha até <strong>{totalSlots}</strong> treinadas: até{" "}
            <strong>{slotsClasse}</strong> da lista da classe
            {slotsInteligencia > 0 && (
              <>, até <strong>{slotsInteligencia}</strong> de qualquer perícia (Int)</>
            )}
            {slotsCE > 0 && (
              <>, até <strong>{slotsCE}</strong> de perícias de Inteligência (Conhecimento Enciclopédico)</>
            )}
            .
          </>
        )}
      </p>
    ) : null;

  return (
    <section className="space-y-4 rounded-md border border-border bg-paper-card p-5 shadow-sm">
      <h2 className="font-serif text-base font-semibold text-ink">Perícias</h2>
      <p className="text-xs text-ink-muted">
        Use o atributo sugerido ou ajuste conforme a mesa. O total já inclui
        modificador de atributo, treinamento (+2) e bônus extras.
      </p>
      {resumoClasse}

      <div className="grid gap-2 md:grid-cols-2">
        <div className="min-w-0 overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
                  Tot
                </th>
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
                  T
                </th>
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
                  Perícia
                </th>
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
                  Atr
                </th>
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
                  B.
                </th>
              </tr>
            </thead>
            <tbody>{renderRows(leftSkills)}</tbody>
          </table>
        </div>

        <div className="min-w-0 overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
                  Tot
                </th>
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
                  T
                </th>
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
                  Perícia
                </th>
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
                  Atr
                </th>
                <th className="px-1 py-1 text-left font-semibold text-ink-muted">
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

