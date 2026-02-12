import type { CharacterSheet } from "@/lib/models/character";
import { getOrigemByNome } from "@/lib/data/tormenta20";

export function applyOriginByName(
  sheet: CharacterSheet,
  nextOriginName: string,
): CharacterSheet {
  const origem = getOrigemByNome(nextOriginName);

  const nextSheet: CharacterSheet = {
    ...sheet,
    origem: nextOriginName,
  };

  if (!origem) {
    return nextSheet;
  }

  let habilidadesRacaOrigem = nextSheet.habilidades.habilidadesRacaOrigem;

  if (
    (!habilidadesRacaOrigem || habilidadesRacaOrigem.trim().length === 0) &&
    origem.poderes &&
    origem.poderes.length > 0
  ) {
    const linhas = [
      `Origem: ${origem.nome}`,
      "",
      ...origem.poderes.map((texto) => `- ${texto}`),
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

