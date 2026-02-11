export type GameSystem = "T20" | "custom";

export type AbilityScoreName =
  | "forca"
  | "destreza"
  | "constituicao"
  | "inteligencia"
  | "sabedoria"
  | "carisma";

export interface AbilityScores {
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
}

export interface CharacterClass {
  id: string;
  nome: string;
  nivel: number;
  notas?: string;
}

export interface DerivedStatsConfig {
  atributoHp: AbilityScoreName;
  atributoDefesa: AbilityScoreName;
}

export interface CharacterSkill {
  id: string;
  atributoUsado: AbilityScoreName;
  bonusOutros: number;
  treinada: boolean;
}

export interface CombatStats {
  pvAtual: number;
  pvMaximo: number;
  pmAtual: number;
  pmMaximo: number;
  caTotal: number;
  penalidadeArmadura: number;
  deslocamento: number;
}

export interface ArmorProficiency {
  tipo: string;
  defesa: number;
  penalidade: number;
  proficiencia: string;
}

export interface WeaponProficiencies {
  simples: boolean;
  marciais: boolean;
  exoticas: boolean;
  deFogo: boolean;
}

export interface SenseInfo {
  visaoPenumbra: boolean;
  visaoEscuro: boolean;
  outros: string;
}

export interface ProficienciasCombate {
  armadura: ArmorProficiency;
  escudo: ArmorProficiency;
  armas: WeaponProficiencies;
  sentidos: SenseInfo;
}

export interface MagicInfo {
  cd: number;
}

export interface CharacterAttack {
  id: string;
  nome: string;
  teste: string;
  bonusAtaque: number;
  dano: string;
  critico: number;
  tipo: string;
  alcance: string;
}

export interface InventoryItem {
  id: string;
  nome: string;
  quantidade: number;
  slots: number;
  descricao?: string;
  valor?: number;
  observacoes?: string;
}

export interface Inventory {
  itens: InventoryItem[];
  limiteCarga: number;
  cargaUsada: number;
  dinheiro: number;
}

export interface CharacterAbilitySections {
  habilidadesRacaOrigem: string;
  habilidadesClassePoderes: string;
}

export interface CharacterSpell {
  id: string;
  nome: string;
  escola?: string;
  execucao?: string;
  alcance?: string;
  area?: string;
  duracao?: string;
  resistencia?: string;
  efeito?: string;
  atributoChave?: string;
  cd?: number;
}

export interface CharacterNotes {
  descricao: string;
  historicoAliadosTesouros: string;
  anotacoesGerais: string;
}

export interface CharacterSheet {
  id: string;
  sistema: GameSystem;

  nome: string;
  raca: string;
  origem: string;
  classePrincipal: string;
  classesSecundarias: string;
  nivel: number;
  divindade: string;
  tamanho: string;

  atributos: AbilityScores;
  combate: CombatStats;
  proficiencias: ProficienciasCombate;
  magia: MagicInfo;
  ataques: CharacterAttack[];
  experiencia: number;
  inventario: Inventory;
  habilidades: CharacterAbilitySections;
  magias: CharacterSpell[];
  notas: CharacterNotes;

  classes: CharacterClass[];
  pericias: CharacterSkill[];
  config: {
    derived: DerivedStatsConfig;
  };

  createdAt: string;
  updatedAt: string;
}

export function normalizeCharacter(raw: CharacterSheet): CharacterSheet {
  const fallbackConfig: DerivedStatsConfig = {
    atributoHp: "constituicao",
    atributoDefesa: "destreza",
  };

  const config =
    raw.config && raw.config.derived
      ? {
          derived: {
            atributoHp:
              raw.config.derived.atributoHp ?? fallbackConfig.atributoHp,
            atributoDefesa:
              raw.config.derived.atributoDefesa ?? fallbackConfig.atributoDefesa,
          },
        }
      : { derived: fallbackConfig };

  const classes: CharacterClass[] =
    raw.classes && raw.classes.length > 0
      ? raw.classes
      : raw.classePrincipal
        ? [
            {
              id: raw.classePrincipal.toLowerCase().replace(/\s+/g, "-"),
              nome: raw.classePrincipal,
              nivel: raw.nivel ?? 1,
            },
          ]
        : [];

  const pericias: CharacterSkill[] = raw.pericias ?? [];

  const proficiencias: ProficienciasCombate =
    raw.proficiencias ?? {
      armadura: {
        tipo: "",
        defesa: 0,
        penalidade: 0,
        proficiencia: "",
      },
      escudo: {
        tipo: "",
        defesa: 0,
        penalidade: 0,
        proficiencia: "",
      },
      armas: {
        simples: false,
        marciais: false,
        exoticas: false,
        deFogo: false,
      },
      sentidos: {
        visaoPenumbra: false,
        visaoEscuro: false,
        outros: "",
      },
    };

  const magia: MagicInfo = raw.magia ?? { cd: 10 };
  const inventario: Inventory = {
    itens: raw.inventario?.itens ?? [],
    limiteCarga: raw.inventario?.limiteCarga ?? 10,
    cargaUsada: raw.inventario?.cargaUsada ?? 0,
    dinheiro: raw.inventario?.dinheiro ?? 0,
  };

  return {
    ...raw,
    classes,
    pericias,
    config,
    ataques: raw.ataques ?? [],
    proficiencias,
    magia,
    inventario,
  };
}

export function syncClassesToLegacyFields(sheet: CharacterSheet): CharacterSheet {
  if (!sheet.classes || sheet.classes.length === 0) {
    return sheet;
  }

  const principal = sheet.classes[0];
  const secundarias = sheet.classes.slice(1).map((klass) => klass.nome).join(" / ");

  return {
    ...sheet,
    classePrincipal: principal.nome,
    classesSecundarias: secundarias,
    nivel: principal.nivel,
  };
}

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function createEmptyCharacterSheet(nome: string): CharacterSheet {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    sistema: "T20",

    nome,
    raca: "",
    origem: "",
    classePrincipal: "",
    classesSecundarias: "",
    nivel: 1,
    divindade: "",
    tamanho: "",

    atributos: {
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      sabedoria: 10,
      carisma: 10,
    },

    combate: {
      pvAtual: 1,
      pvMaximo: 1,
      pmAtual: 0,
      pmMaximo: 0,
      caTotal: 10,
      penalidadeArmadura: 0,
      deslocamento: 9,
    },

    proficiencias: {
      armadura: {
        tipo: "",
        defesa: 0,
        penalidade: 0,
        proficiencia: "",
      },
      escudo: {
        tipo: "",
        defesa: 0,
        penalidade: 0,
        proficiencia: "",
      },
      armas: {
        simples: false,
        marciais: false,
        exoticas: false,
        deFogo: false,
      },
      sentidos: {
        visaoPenumbra: false,
        visaoEscuro: false,
        outros: "",
      },
    },

    magia: {
      cd: 10,
    },

    ataques: [],

    experiencia: 0,

    inventario: {
      itens: [],
      limiteCarga: 10,
      cargaUsada: 0,
      dinheiro: 0,
    },

    habilidades: {
      habilidadesRacaOrigem: "",
      habilidadesClassePoderes: "",
    },

    magias: [],

    notas: {
      descricao: "",
      historicoAliadosTesouros: "",
      anotacoesGerais: "",
    },

    classes: [],
    pericias: [],
    config: {
      derived: {
        atributoHp: "constituicao",
        atributoDefesa: "destreza",
      },
    },

    createdAt: now,
    updatedAt: now,
  };
}

