import type { CharacterSheet } from "@/lib/models/character";
import { getRacas } from "@/lib/data/tormenta20";

interface RaceRules {
  id: string;
  nome: string;
  bonusAtributos?: Partial<CharacterSheet["atributos"]>;
  // Futuro: poderes/habilidades raciais textuais.
  habilidades?: string[];
}

// Modificadores de atributo por raça, conforme Tabela 1-2 do livro básico.
// Raças com bônus flexível (+1 em três atributos diferentes) ou sub-raças
// (como suraggel) não são aplicadas aqui por enquanto — exigem escolha
// manual do jogador.
const RAW_RACE_RULES: Record<
  string,
  Partial<CharacterSheet["atributos"]>
> = {
  // humano: +1 em três atributos diferentes (não fixo).
  anao: { constituicao: 2, sabedoria: 1, destreza: -1 },
  dahllan: { sabedoria: 2, destreza: 1, inteligencia: -1 },
  elfo: { inteligencia: 2, destreza: 1, constituicao: -1 },
  goblin: { destreza: 2, inteligencia: 1, carisma: -1 },
  // lefou: +1 em três atributos diferentes (exceto Car) — não aplicamos ainda.
  minotauro: { forca: 2, constituicao: 1, sabedoria: -1 },
  qareen: { carisma: 2, inteligencia: 1, sabedoria: -1 },
  golem: { forca: 2, constituicao: 1, carisma: -1 },
  hynne: { destreza: 2, carisma: 1, forca: -1 },
  kliren: { inteligencia: 2, carisma: 1, forca: -1 },
  medusa: { destreza: 2, carisma: 1 },
  osteon: { constituicao: -1 }, // +1 em três atributos diferentes (exceto Con) não aplicado aqui.
  // sereia-tritao: +1 em três atributos diferentes — não aplicamos ainda.
  sifide: { carisma: 2, destreza: 1, forca: -2 },
  // suraggel: depende de sub-raça (aggelus/sulfure) — deixamos para escolha manual.
  trog: { constituicao: 2, forca: 1, inteligencia: -1 },
};

// Mapeia as raças conhecidas para permitir automação simples.
function buildRaceRules(): RaceRules[] {
  const racas = getRacas();

  return racas.map((race) => ({
    id: race.id,
    nome: race.nome,
    bonusAtributos: RAW_RACE_RULES[race.id],
  }));
}

const raceRulesCache: RaceRules[] = buildRaceRules();

function findRaceRulesByName(nome: string): RaceRules | undefined {
  if (!nome) return undefined;
  return raceRulesCache.find((race) => race.nome === nome);
}

export function applyRaceByName(
  sheet: CharacterSheet,
  nextRaceName: string,
): CharacterSheet {
  const rules = findRaceRulesByName(nextRaceName);

  // Sempre atualizamos apenas o campo de texto de raça; se não houver
  // regras cadastradas ainda, retornamos a ficha com o resto intacto.
  const nextSheet: CharacterSheet = {
    ...sheet,
    raca: nextRaceName,
  };

  if (!rules) {
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

  if (todosPadrao && rules.bonusAtributos) {
    atributos = {
      ...atributos,
      ...Object.entries(rules.bonusAtributos).reduce(
        (acc, [key, value]) => {
          const abilityKey = key as keyof typeof atributos;
          const bonus = value ?? 0;
          acc[abilityKey] = atributos[abilityKey] + bonus;
          return acc;
        },
        {} as Partial<typeof atributos>,
      ),
    };
  }

  let habilidadesRacaOrigem = nextSheet.habilidades.habilidadesRacaOrigem;

  // Se o jogador ainda não escreveu nada manualmente, podemos preencher
  // um resumo básico das habilidades raciais cadastradas.
  if (
    (!habilidadesRacaOrigem || habilidadesRacaOrigem.trim().length === 0) &&
    rules.habilidades &&
    rules.habilidades.length > 0
  ) {
    const linhas = [
      `Raça: ${rules.nome}`,
      "",
      ...rules.habilidades.map((texto) => `- ${texto}`),
    ];
    habilidadesRacaOrigem = linhas.join("\n");
  }

  return {
    ...nextSheet,
    atributos,
    habilidades: {
      ...nextSheet.habilidades,
      habilidadesRacaOrigem,
    },
  };
}

