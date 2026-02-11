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

export interface CombatStats {
  pvAtual: number;
  pvMaximo: number;
  pmAtual: number;
  pmMaximo: number;
  caTotal: number;
  penalidadeArmadura: number;
  deslocamento: number;
}

export interface InventoryItem {
  id: string;
  nome: string;
  quantidade: number;
  slots: number;
  observacoes?: string;
}

export interface Inventory {
  itens: InventoryItem[];
  limiteCarga: number;
  cargaUsada: number;
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
  experiencia: number;
  inventario: Inventory;
  habilidades: CharacterAbilitySections;
  magias: CharacterSpell[];
  notas: CharacterNotes;

  createdAt: string;
  updatedAt: string;
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

    experiencia: 0,

    inventario: {
      itens: [],
      limiteCarga: 10,
      cargaUsada: 0,
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

    createdAt: now,
    updatedAt: now,
  };
}

