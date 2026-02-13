import type { AbilityScoreName, CharacterSheet } from "@/lib/models/character";
import { getRacas } from "@/lib/data/tormenta20";
import type {
  BonusFlexivelRaca,
  ModificadorAtributoRaca,
  PericiasExtrasRaca,
  ProficienciasRaca,
  RacaJson,
  SentidosRaca,
  TipoCriaturaRaca,
} from "@/lib/t20/jsonTypes";

export interface FlexRaceRule {
  pointsPerAttr: number;
  count: number;
  except?: AbilityScoreName[];
}

const racasCache: RacaJson[] = getRacas();

function findRaceByName(nome: string): RacaJson | undefined {
  if (!nome?.trim()) return undefined;
  const normalized = nome.trim();
  const lower = normalized.toLowerCase();
  return (
    racasCache.find((race) => race.nome === normalized) ??
    racasCache.find((race) => race.nome.toLowerCase() === lower) ??
    racasCache.find((race) => String(race.id).toLowerCase() === lower)
  );
}

export function getRaceDataByName(nome: string): RacaJson | undefined {
  return findRaceByName(nome);
}

const TIPO_CRIATURA_LABELS: Record<TipoCriaturaRaca, string> = {
  humanoide: "Humanoide",
  monstro: "Monstro",
  espirito: "Espírito",
  morto_vivo: "Morto-vivo",
  construto: "Construto",
};

export function getTipoCriaturaLabel(tipo: TipoCriaturaRaca | undefined): string {
  if (!tipo) return "—";
  return TIPO_CRIATURA_LABELS[tipo] ?? tipo;
}

function buildFixedAbilityBonus(
  modificadores?: ModificadorAtributoRaca[],
): Partial<CharacterSheet["atributos"]> {
  if (!modificadores || modificadores.length === 0) return {};
  return modificadores.reduce<Partial<CharacterSheet["atributos"]>>(
    (acc, mod) => {
      const current = acc[mod.atributo] ?? 0;
      acc[mod.atributo] = current + mod.valor;
      return acc;
    },
    {},
  );
}

function toFlexRaceRule(
  bonusFlexivel?: BonusFlexivelRaca,
): FlexRaceRule | undefined {
  if (!bonusFlexivel) return undefined;
  return {
    pointsPerAttr: bonusFlexivel.pontos_por_atributo,
    count: bonusFlexivel.quantidade,
    except: bonusFlexivel.atributos_proibidos,
  };
}

export function getFlexRaceRule(raceNome: string): FlexRaceRule | undefined {
  const race = findRaceByName(raceNome);
  if (!race) return undefined;
  return toFlexRaceRule(race.bonus_flexivel);
}

export function getRaceAbilityBonusByName(
  nome: string,
  flexChoice?: Partial<CharacterSheet["atributos"]>,
): Partial<CharacterSheet["atributos"]> | undefined {
  const race = findRaceByName(nome);
  if (!race) return undefined;

  const flexRule = toFlexRaceRule(race.bonus_flexivel);
  const fixos = buildFixedAbilityBonus(race.modificadores_atributos);

  if (flexRule && flexChoice) {
    const except = flexRule.except ?? [];
    const result = { ...fixos };
    for (const key of Object.keys(flexChoice) as (keyof CharacterSheet["atributos"])[]) {
      if (!except.includes(key as AbilityScoreName)) {
        const atual = result[key] ?? 0;
        const extra = flexChoice[key] ?? 0;
        result[key] = atual + extra;
      }
    }
    return result;
  }
  if (flexRule) {
    return Object.keys(fixos).length > 0 ? fixos : undefined;
  }
  return Object.keys(fixos).length > 0 ? fixos : undefined;
}

export function applyRaceByName(
  sheet: CharacterSheet,
  nextRaceName: string,
): CharacterSheet {
  const race = findRaceByName(nextRaceName);

  const nextSheet: CharacterSheet = {
    ...sheet,
    raca: nextRaceName,
    racaBonusFlexivel:
      sheet.raca === nextRaceName ? sheet.racaBonusFlexivel : undefined,
  };

  if (!race) {
    return nextSheet;
  }

  let atributos = nextSheet.atributos;

  // Aplicamos bônus de atributos apenas se todos ainda estiverem no valor
  // padrão da ficha vazia (10). Isso evita acumular bônus toda vez que
  // o usuário troca a raça.
  const todosPadrao =
    atributos.forca === 10 &&
    atributos.destreza === 10 &&
    atributos.constituicao === 10 &&
    atributos.inteligencia === 10 &&
    atributos.sabedoria === 10 &&
    atributos.carisma === 10;

  if (todosPadrao) {
    const bonus = buildFixedAbilityBonus(race.modificadores_atributos);
    if (Object.keys(bonus).length > 0) {
      atributos = {
        ...atributos,
        ...Object.entries(bonus).reduce(
          (acc, [key, value]) => {
            const abilityKey = key as keyof typeof atributos;
            const bonusValue = value ?? 0;
            acc[abilityKey] = atributos[abilityKey] + bonusValue;
            return acc;
          },
          {} as Partial<typeof atributos>,
        ),
      };
    }
  }

  // Aplicamos ajustes básicos de raça que são claramente automáticos:
  // - deslocamento base
  // - tamanho
  // - sentidos (visão no escuro / penumbra)
  // - proficiência simples em armas de fogo (quando a raça concede)
  let combate = nextSheet.combate;
  if (typeof race.deslocamento_base === "number") {
    combate = {
      ...combate,
      deslocamento: race.deslocamento_base,
    };
  }

  let tamanho = nextSheet.tamanho;
  if (race.tamanho) {
    tamanho = race.tamanho;
  }

  let proficiencias = nextSheet.proficiencias;
  if (race.sentidos) {
    proficiencias = {
      ...proficiencias,
      sentidos: {
        ...proficiencias.sentidos,
        visaoPenumbra: !!race.sentidos.visao_penumbra,
        visaoEscuro: !!race.sentidos.visao_escuro,
        visaoMistica: !!race.sentidos.visao_mistica,
        outros: race.sentidos.outros?.join(", ") ?? proficiencias.sentidos.outros,
      },
    };
  }

  if (race.proficiencias?.armas?.length) {
    const hasFirearms = race.proficiencias.armas.includes("armas_de_fogo");
    if (hasFirearms) {
      proficiencias = {
        ...proficiencias,
        armas: {
          ...proficiencias.armas,
          deFogo: true,
        },
      };
    }
  }

  let habilidadesRacaOrigem = nextSheet.habilidades.habilidadesRacaOrigem;

  // Se o jogador ainda não escreveu nada manualmente, podemos preencher
  // um resumo básico das habilidades raciais cadastradas com base nos
  // poderes automáticos descritos no JSON.
  if (
    (!habilidadesRacaOrigem || habilidadesRacaOrigem.trim().length === 0) &&
    race.poderes_automaticos &&
    race.poderes_automaticos.length > 0
  ) {
    const linhas = [
      `Raça: ${race.nome}`,
      "",
      ...race.poderes_automaticos.map((poder) => {
        const descricao =
          poder.descricao_resumida && poder.descricao_resumida.length > 0
            ? `: ${poder.descricao_resumida}`
            : "";
        return `- ${poder.nome}${descricao}`;
      }),
    ];
    habilidadesRacaOrigem = linhas.join("\n");
  }

  return {
    ...nextSheet,
    atributos,
    combate,
    tamanho,
    proficiencias,
    habilidades: {
      ...nextSheet.habilidades,
      habilidadesRacaOrigem,
    },
  };
}

export function getRaceSentidos(raceNome: string): SentidosRaca | undefined {
  const race = findRaceByName(raceNome);
  return race?.sentidos;
}

export function getRacePericiasExtras(
  raceNome: string,
): PericiasExtrasRaca | undefined {
  const race = findRaceByName(raceNome);
  return race?.pericias_extras;
}

export function getRaceProficiencias(
  raceNome: string,
): ProficienciasRaca | undefined {
  const race = findRaceByName(raceNome);
  return race?.proficiencias;
}

