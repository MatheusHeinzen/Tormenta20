import type { CharacterSheet } from "@/lib/models/character";
import { applyRaceByName } from "@/lib/t20/race";
import { applyOriginByName } from "@/lib/t20/origin";
import { applyClassRules } from "@/lib/t20/class";

/**
 * Aplica regras derivadas de Tormenta 20 quando campos-chave da ficha mudam.
 *
 * - Quando a raça muda, tenta aplicar bônus raciais e habilidades.
 * - Quando a origem muda, tenta adicionar o poder da origem.
 * - Sempre que as classes mudam, recalcula PV/PM máximos com base nas regras.
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

  // Recalcula PV/PM sempre que houver mudança em classes ou atributos.
  // Isso mantém o cálculo consistente sem espalhar regra pela UI.
  if (
    next.classes !== prev.classes ||
    next.atributos !== prev.atributos ||
    next.config.derived.atributoHp !== prev.config.derived.atributoHp
  ) {
    result = applyClassRules(result);
  }

  return result;
}

