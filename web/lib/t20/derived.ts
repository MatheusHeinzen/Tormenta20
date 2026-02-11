import type { CharacterSheet } from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";
import { applyRaceByName } from "@/lib/t20/race";
import { applyOriginByName } from "@/lib/t20/origin";
import { applyClassRules } from "@/lib/t20/class";

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
    next.config.derived.atributoHp !== prev.config.derived.atributoHp
  ) {
    result = applyClassRules(result);
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

