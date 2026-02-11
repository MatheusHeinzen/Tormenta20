import type { CharacterSheet } from "@/lib/models/character";
import { getOrigens } from "@/lib/data/tormenta20";

interface OriginRules {
  id: string;
  nome: string;
  // TODO: preencher com poderes/benefícios oficiais de cada origem.
  poderes?: string[];
}

function buildOriginRules(): OriginRules[] {
  const origens = getOrigens();

  return origens.map((origin) => ({
    id: origin.id,
    nome: origin.nome,
  }));
}

const originRulesCache: OriginRules[] = buildOriginRules();

function findOriginRulesByName(nome: string): OriginRules | undefined {
  if (!nome) return undefined;
  return originRulesCache.find((origin) => origin.nome === nome);
}

export function applyOriginByName(
  sheet: CharacterSheet,
  nextOriginName: string,
): CharacterSheet {
  const rules = findOriginRulesByName(nextOriginName);

  const nextSheet: CharacterSheet = {
    ...sheet,
    origem: nextOriginName,
  };

  if (!rules) {
    return nextSheet;
  }

  let habilidadesRacaOrigem = nextSheet.habilidades.habilidadesRacaOrigem;

  // Se ainda não houver nada registrado, adicionamos um bloco simples
  // com a origem escolhida e seus poderes configurados (quando houver).
  if (
    (!habilidadesRacaOrigem || habilidadesRacaOrigem.trim().length === 0) &&
    rules.poderes &&
    rules.poderes.length > 0
  ) {
    const linhas = [
      `Origem: ${rules.nome}`,
      "",
      ...rules.poderes.map((texto) => `- ${texto}`),
    ];
    habilidadesRacaOrigem = linhas.join("\n");
  }

  return {
    ...nextSheet,
    habilidades: {
      ...nextSheet.habilidades,
      habilidadesRacaOrigem,
    },
  };
}

