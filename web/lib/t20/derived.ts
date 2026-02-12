import type { CharacterSheet } from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";
import { applyRaceByName, getRaceDataByName } from "@/lib/t20/race";
import { applyOriginByName } from "@/lib/t20/origin";
import { applyClassProficiencies, applyClassRules } from "@/lib/t20/class";

/**
 * CA = 10 + (modificador do atributo de defesa) + armadura + escudo + bônus.
 */
function computeCA(sheet: CharacterSheet): number {
  const attr = sheet.config?.derived?.atributoDefesa ?? "destreza";
  const mod = abilityModifier(sheet.atributos[attr]);
  const armadura = sheet.proficiencias?.armadura?.defesa ?? 0;
  const escudo = sheet.proficiencias?.escudo?.defesa ?? 0;
  const bonus = sheet.combate?.caBonus ?? 0;
  return 10 + mod + armadura + escudo + bonus;
}

/**
 * Penalidade de armadura = penalidade da armadura + penalidade do escudo.
 */
function computePenalidadeArmadura(sheet: CharacterSheet): number {
  const armadura = sheet.proficiencias?.armadura?.penalidade ?? 0;
  const escudo = sheet.proficiencias?.escudo?.penalidade ?? 0;
  return armadura + escudo;
}

/**
 * Aplica efeitos mecânicos simples de raça que afetam PV/PM máximos.
 * Hoje avaliamos apenas efeitos definidos em poderes raciais:
 * - alvo "vida" ou "mana"
 * - tipo_efeito "bonus_por_nivel" ou "bonus_fixo"/"ajuste_mana"
 */
function applyRaceLifeAndManaBonuses(sheet: CharacterSheet): CharacterSheet {
  const race = getRaceDataByName(sheet.raca);
  if (!race) return sheet;

  const totalNivel =
    sheet.classes && sheet.classes.length > 0
      ? sheet.classes.reduce((acc, klass) => acc + klass.nivel, 0)
      : sheet.nivel || 1;

  const efeitos =
    race.poderes_automaticos?.flatMap((poder) => poder.efeitos_mecanicos) ?? [];

  let extraVida = 0;
  let extraMana = 0;

  for (const efeito of efeitos) {
    if (efeito.alvo !== "vida" && efeito.alvo !== "mana") continue;

    const nivelMinimo = efeito.nivel_minimo ?? 1;
    if (totalNivel < nivelMinimo) continue;

    if (efeito.tipo_efeito === "bonus_por_nivel") {
      const niveisConsiderados = Math.max(0, totalNivel - (nivelMinimo - 1));
      const valor = niveisConsiderados * efeito.valor_base;
      if (efeito.alvo === "vida") extraVida += valor;
      else extraMana += valor;
    } else if (
      efeito.tipo_efeito === "bonus_fixo" ||
      efeito.tipo_efeito === "ajuste_mana"
    ) {
      if (efeito.alvo === "vida") extraVida += efeito.valor_base;
      else extraMana += efeito.valor_base;
    }
  }

  if (extraVida === 0 && extraMana === 0) {
    return sheet;
  }

  const basePv = sheet.combate.pvMaximo;
  const basePm = sheet.combate.pmMaximo;

  return {
    ...sheet,
    combate: {
      ...sheet.combate,
      pvMaximo: basePv + extraVida,
      pmMaximo: basePm + extraMana,
    },
  };
}

/**
 * Aplica regras derivadas completas em uma ficha (PV/PM, bônus raciais, CA, etc).
 * Usado na inicialização do formulário para garantir valores corretos ao carregar.
 */
export function computeFullDerivedSheet(sheet: CharacterSheet): CharacterSheet {
  let result = applyClassRules(sheet);
  result = applyClassProficiencies(result);
  result = applyRaceLifeAndManaBonuses(result);
  return {
    ...result,
    combate: {
      ...result.combate,
      caTotal: computeCA(result),
      penalidadeArmadura: computePenalidadeArmadura(result),
    },
  };
}

/**
 * Aplica regras derivadas de Tormenta 20 quando campos-chave da ficha mudam.
 *
 * - Quando a raça muda, tenta aplicar bônus raciais e habilidades.
 * - Quando a origem muda, tenta adicionar o poder da origem.
 * - Sempre que as classes mudam, recalcula PV/PM máximos com base nas regras.
 * - CA é sempre recalculada: 10 + mod atributo defesa + armadura + escudo + bônus.
 *
 * Esta função é pura: recebe o estado anterior e o próximo, e devolve
 * um novo estado já ajustado, sem efeitos colaterais.
 */
export function applyT20DerivedChanges(
  prev: CharacterSheet,
  next: CharacterSheet,
): CharacterSheet {
  let result = next;

  if (next.raca !== prev.raca) {
    result = applyRaceByName(result, next.raca);
  }

  if (next.origem !== prev.origem) {
    result = applyOriginByName(result, next.origem);
  }

  if (
    next.classes !== prev.classes ||
    next.atributos !== prev.atributos ||
    next.config.derived.atributoHp !== prev.config.derived.atributoHp ||
    next.raca !== prev.raca
  ) {
    result = applyClassRules(result);
    result = applyClassProficiencies(result);
    result = applyRaceLifeAndManaBonuses(result);
  }

  result = {
    ...result,
    combate: {
      ...result.combate,
      caTotal: computeCA(result),
      penalidadeArmadura: computePenalidadeArmadura(result),
    },
  };

  return result;
}

