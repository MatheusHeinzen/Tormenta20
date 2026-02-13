import type { AbilityScoreName } from "@/lib/models/character";

export type EfeitoAlvo =
  | "atributo"
  | "vida"
  | "mana"
  | "pericia"
  | "ataque"
  | "defesa"
  | "outro";

export type TipoEfeito =
  | "bonus_fixo"
  | "bonus_por_nivel"
  | "modificador_dado_vida"
  | "ajuste_mana"
  | "outro";

export type OperacaoEfeito = "add" | "mul" | "set";

/**
 * Modelo genérico para efeitos mecânicos usados em raças, classes,
 * poderes de classe, origens e divindades.
 *
 * A ideia é ter dados suficientes para automatizar cálculos simples
 * (bônus fixos, por nível, ajustes de PV/PM) sem tentar codificar
 * todas as regras complexas de Tormenta 20 dentro do JSON.
 */
export interface EfeitoMecanico {
  alvo: EfeitoAlvo;
  tipo_efeito: TipoEfeito;
  operacao: OperacaoEfeito;

  /**
   * Valor base do efeito. Por exemplo:
   * - +2 em um atributo
   * - +1 PV por nível
   * - multiplicador 1.5 em algum recurso
   */
  valor_base: number;

  /**
   * Quando o alvo é um atributo ou requer referência a atributo.
   */
  atributo?: AbilityScoreName;

  /**
   * Indica que o valor escala por nível do personagem ou da classe
   * que concedeu o efeito.
   */
  por_nivel?: boolean;

  /**
   * Nível mínimo para o efeito começar a valer.
   */
  nivel_minimo?: number;

  /**
   * Campo livre para anotar condições (ex.: "contra_veneno",
   * "em_trevas", "usando_armadura_pesada"). A lógica condicional
   * pode ser implementada em TypeScript no futuro usando este rótulo.
   */
  condicao?: string;
}

// Raças ----------------------------------------------------------------------

export interface ModificadorAtributoRaca {
  atributo: AbilityScoreName;
  valor: number;
}

export interface BonusFlexivelRaca {
  pontos_por_atributo: number;
  quantidade: number;
  atributos_proibidos?: AbilityScoreName[];
}

export type TamanhoRaca = "Minusculo" | "Pequeno" | "Medio" | "Grande" | "Enorme";

export type TipoCriaturaRaca =
  | "humanoide"
  | "monstro"
  | "espirito"
  | "morto_vivo"
  | "construto";

export interface SentidosRaca {
  visao_escuro?: boolean;
  visao_penumbra?: boolean;
  visao_mistica?: boolean;
  outros?: string[];
}

export interface ProficienciasRaca {
  armas?: string[];
  armaduras?: string[];
  escudos?: string[];
}

export interface PericiasExtrasRaca {
  /** Quantidade de perícias adicionais concedidas pela raça. */
  quantidade: number;
  /**
   * Lista opcional de perícias pré-definidas.
   * Quando omitida, entende-se que a escolha é livre (dentro das básicas, conforme regra da raça).
   */
  opcoes?: string[];
  /** Indica se a escolha é totalmente livre entre as perícias elegíveis. */
  livre?: boolean;
  /** Origem principal das perícias extras (raça em si ou um poder racial específico). */
  origem?: "raca" | "poder_racial";
}

export interface PoderAutomaticoRaca {
  id: string;
  nome: string;
  tipo: "ativo" | "passivo";
  descricao_resumida?: string;
  efeitos_mecanicos: EfeitoMecanico[];
}

export interface RacaJson {
  id: string;
  nome: string;
  modificadores_atributos?: ModificadorAtributoRaca[];
  bonus_flexivel?: BonusFlexivelRaca;
  deslocamento_base?: number;
  vida_extra_por_nivel?: number;
  tamanho?: TamanhoRaca;
  tipo_criatura?: TipoCriaturaRaca;
  sentidos?: SentidosRaca;
  proficiencias?: ProficienciasRaca;
  pericias_extras?: PericiasExtrasRaca;
  poderes_automaticos?: PoderAutomaticoRaca[];
  descricao_resumida?: string;
}

// Classes --------------------------------------------------------------------

export interface PericiasIniciaisClasse {
  quantidade: number;
  opcoes: string[];
}

export interface ProficienciasClasse {
  armas?: string[];
  armaduras?: string[];
  escudos?: string[];
}

export interface HabilidadesNivelClasse {
  nivel: number;
  poderes: string[]; // ids em poderes_classe.json
}

export interface MagiaProgressaoCirculoClasse {
  nivel_personagem: number;
  circulo: number;
}

export interface RegrasMagiaCaminho {
  magias_iniciais?: number;
  magias_por_nivel: string;
  memoriza_metade?: boolean;
}

export interface MagiaClasseJson {
  /** Indica se a classe realmente conjura magias. */
  conjurador: boolean;
  /**
   * Atributo principal usado para CD e testes de magia.
   * Em classes com caminhos diferentes, pode ser omitido e
   * detalhado em atributo_chave_por_caminho.
   */
  atributo_chave?: AbilityScoreName | null;
  /**
   * Mapa opcional para classes com caminhos/arquetipos que
   * mudam o atributo chave (ex.: Arcanista: bruxo/feiticeiro/mago).
   */
  atributo_chave_por_caminho?: Record<string, AbilityScoreName>;
  /** Maior círculo de magia que a classe alcança. */
  circulo_maximo: number;
  /** Níveis em que a classe destrava novos círculos. */
  progressao_circulos: MagiaProgressaoCirculoClasse[];
  /** Quantidade de magias conhecidas/preparadas no 1º nível. */
  magias_iniciais: number;
  /**
   * Regra simples para ganho de magias por nível.
   * Exemplos de valores:
   * - "1_por_nivel"
   * - "1_niveis_pares"
   */
  magias_por_nivel: string;
  /**
   * Regras por caminho (Arcanista: bruxo, feiticeiro, mago).
   * Quando presente, magias_iniciais e magias_por_nivel são sobrescritos pelo caminho.
   */
  regras_por_caminho?: Record<string, RegrasMagiaCaminho>;
}

export interface ClasseJson {
  id: string;
  nome: string;
  vida_nivel_1?: number;
  vida_por_nivel?: number;
  mana_por_nivel?: number;
  /**
   * Perícias básicas da classe (sempre consideradas treinadas
   * para fins de cálculo de perícias base).
   */
  pericias_base?: string[];
  /**
   * Lista de perícias que o jogador pode escolher ao receber
   * perícias treinadas pela classe.
   */
  pericias_treinaveis?: string[];
  /**
   * Quantidade de perícias treinadas que a classe concede.
   * Pode ser um número fixo (ex.: 4) ou uma expressão simples
   * como "2+inteligencia".
   */
  pericias_treinadas?: number | string;
  pericias_iniciais?: PericiasIniciaisClasse;
  proficiencias?: ProficienciasClasse;
  habilidades_por_nivel?: HabilidadesNivelClasse[];
  /** Dados agregados sobre progressão de magias da classe. */
  magia?: MagiaClasseJson;
  descricao_resumida?: string;
}

// Poderes de classe ---------------------------------------------------------

export interface RequisitosPoderClasse {
  nivel_minimo?: number;
  outros_poderes?: string[];
}

export interface PoderClasseJson {
  id: string;
  nome: string;
  classe: string; // ClasseJson["id"]
  tipo: "ativo" | "passivo";
  descricao_resumida?: string;
  efeitos_mecanicos: EfeitoMecanico[];
  requisitos?: RequisitosPoderClasse;
  pode_escolher_multiplas_vezes?: boolean;
}

// Magias ---------------------------------------------------------------------

export interface ParametrosMagia {
  alcance: string | null;
  alvo: string | null;
  area: string | null;
  duracao: string | null;
  custo_mana: number;
}

export interface MagiaJson {
  id: string;
  nome: string;
  circulo: number;
  escola?: string;
  descricao_resumida?: string;
  parametros: ParametrosMagia;
}

// Origens --------------------------------------------------------------------

export interface OrigemJson {
  id: string;
  nome: string;
  itens?: string[];
  pericias?: string[];
  poderes?: string[];
  beneficios_mecanicos?: EfeitoMecanico[];
  descricao_resumida?: string;
}

// Divindades -----------------------------------------------------------------

export type EnergiaDivindade = "positiva" | "negativa" | "qualquer";

export interface DivindadeJson {
  id: string;
  nome: string;
  energia?: EnergiaDivindade;
  poderes_concedidos?: string[];
  dominios?: string[];
  efeitos_mecanicos?: EfeitoMecanico[];
  descricao_resumida?: string;
}

export interface PoderConcedidoDivindadeJson {
  id: string;
  nome: string;
  descricao?: string;
  efeitos_mecanicos?: EfeitoMecanico[];
}

// Linhagens (Feiticeiro) -----------------------------------------------------

export interface LinhagemJson {
  id: string;
  nome: string;
  descricao_resumida?: string;
  efeitos_mecanicos: EfeitoMecanico[];
}


