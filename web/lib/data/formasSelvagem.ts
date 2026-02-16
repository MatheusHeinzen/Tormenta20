export type FormaSelvagemId =
  | "agil"
  | "feroz"
  | "resistente"
  | "sorrateira"
  | "veloz";

export type TierFormaSelvagem = "base" | "apr" | "sup";

export interface ModificadoresFormaSelvagem {
  forma: FormaSelvagemId;
  tier: TierFormaSelvagem;
  bonusFor: number;
  bonusDes: number;
  bonusDefesa: number;
  reducaoDano: number;
  tamanho: "" | "Minúsculo" | "Pequeno" | "Médio" | "Grande" | "Enorme";
  armasNaturais: string;
  deslocamentoBonus: number;
  deslocamentoTexto?: string;
  penalidadeFurtividade: number;
  bonusManobras: number;
}

const FORMAS: ModificadoresFormaSelvagem[] = [
  {
    forma: "agil",
    tier: "base",
    bonusFor: 0,
    bonusDes: 2,
    bonusDefesa: 0,
    reducaoDano: 0,
    tamanho: "Médio",
    armasNaturais: "2 armas 1d6 (margem 19, -2 ataque com as duas)",
    deslocamentoBonus: 0,
    penalidadeFurtividade: 0,
    bonusManobras: 0,
  },
  {
    forma: "agil",
    tier: "apr",
    bonusFor: 0,
    bonusDes: 4,
    bonusDefesa: 0,
    reducaoDano: 0,
    tamanho: "Grande",
    armasNaturais: "2 armas 1d8",
    deslocamentoBonus: 3,
    penalidadeFurtividade: 2,
    bonusManobras: 2,
  },
  {
    forma: "agil",
    tier: "sup",
    bonusFor: 0,
    bonusDes: 6,
    bonusDefesa: 0,
    reducaoDano: 0,
    tamanho: "Grande",
    armasNaturais: "2 armas 1d10",
    deslocamentoBonus: 6,
    penalidadeFurtividade: 2,
    bonusManobras: 2,
  },
  {
    forma: "feroz",
    tier: "base",
    bonusFor: 3,
    bonusDes: 0,
    bonusDefesa: 2,
    reducaoDano: 0,
    tamanho: "Médio",
    armasNaturais: "1 arma 1d8",
    deslocamentoBonus: 0,
    penalidadeFurtividade: 0,
    bonusManobras: 0,
  },
  {
    forma: "feroz",
    tier: "apr",
    bonusFor: 5,
    bonusDes: 0,
    bonusDefesa: 4,
    reducaoDano: 0,
    tamanho: "Grande",
    armasNaturais: "1 arma 2d6",
    deslocamentoBonus: 0,
    penalidadeFurtividade: 2,
    bonusManobras: 2,
  },
  {
    forma: "feroz",
    tier: "sup",
    bonusFor: 10,
    bonusDes: 0,
    bonusDefesa: 6,
    reducaoDano: 0,
    tamanho: "Enorme",
    armasNaturais: "1 arma 4d6",
    deslocamentoBonus: 0,
    penalidadeFurtividade: 5,
    bonusManobras: 5,
  },
  {
    forma: "resistente",
    tier: "base",
    bonusFor: 0,
    bonusDes: 0,
    bonusDefesa: 5,
    reducaoDano: 5,
    tamanho: "Médio",
    armasNaturais: "1 arma 1d6",
    deslocamentoBonus: 0,
    penalidadeFurtividade: 0,
    bonusManobras: 0,
  },
  {
    forma: "resistente",
    tier: "apr",
    bonusFor: 3,
    bonusDes: 0,
    bonusDefesa: 8,
    reducaoDano: 8,
    tamanho: "Grande",
    armasNaturais: "1 arma 1d8",
    deslocamentoBonus: 0,
    penalidadeFurtividade: 2,
    bonusManobras: 2,
  },
  {
    forma: "resistente",
    tier: "sup",
    bonusFor: 5,
    bonusDes: 0,
    bonusDefesa: 10,
    reducaoDano: 10,
    tamanho: "Enorme",
    armasNaturais: "1 arma 2d6",
    deslocamentoBonus: 0,
    penalidadeFurtividade: 5,
    bonusManobras: 5,
  },
  {
    forma: "sorrateira",
    tier: "base",
    bonusFor: 0,
    bonusDes: 2,
    bonusDefesa: 0,
    reducaoDano: 0,
    tamanho: "Pequeno",
    armasNaturais: "1 arma 1d4",
    deslocamentoBonus: 0,
    penalidadeFurtividade: -2,
    bonusManobras: -2,
  },
  {
    forma: "sorrateira",
    tier: "apr",
    bonusFor: 0,
    bonusDes: 4,
    bonusDefesa: 0,
    reducaoDano: 0,
    tamanho: "Minúsculo",
    armasNaturais: "1 arma 1d4",
    deslocamentoBonus: 0,
    penalidadeFurtividade: -5,
    bonusManobras: -5,
  },
  {
    forma: "sorrateira",
    tier: "sup",
    bonusFor: 0,
    bonusDes: 6,
    bonusDefesa: 0,
    reducaoDano: 0,
    tamanho: "Minúsculo",
    armasNaturais: "1 arma 1d4",
    deslocamentoBonus: 0,
    deslocamentoTexto: "voo 18m",
    penalidadeFurtividade: -5,
    bonusManobras: -5,
  },
  {
    forma: "veloz",
    tier: "base",
    bonusFor: 0,
    bonusDes: 2,
    bonusDefesa: 0,
    reducaoDano: 0,
    tamanho: "Médio",
    armasNaturais: "1 arma 1d6",
    deslocamentoBonus: 0,
    deslocamentoTexto: "15m ou escalar 9m ou nadar 9m",
    penalidadeFurtividade: 0,
    bonusManobras: 0,
  },
  {
    forma: "veloz",
    tier: "apr",
    bonusFor: 0,
    bonusDes: 4,
    bonusDefesa: 0,
    reducaoDano: 0,
    tamanho: "Médio",
    armasNaturais: "1 arma 1d6",
    deslocamentoBonus: 0,
    deslocamentoTexto: "18m / escalar 12m / nadar 12m",
    penalidadeFurtividade: 0,
    bonusManobras: 0,
  },
  {
    forma: "veloz",
    tier: "sup",
    bonusFor: 0,
    bonusDes: 6,
    bonusDefesa: 0,
    reducaoDano: 0,
    tamanho: "Médio",
    armasNaturais: "1 arma 1d6",
    deslocamentoBonus: 0,
    deslocamentoTexto: "nadar 18m ou voo 24m",
    penalidadeFurtividade: 0,
    bonusManobras: 0,
  },
];

export function getModificadoresFormaSelvagem(
  forma: FormaSelvagemId,
  tier: TierFormaSelvagem
): ModificadoresFormaSelvagem | undefined {
  return FORMAS.find((f) => f.forma === forma && f.tier === tier);
}

export const FORMAS_SELVAGEM_IDS: FormaSelvagemId[] = [
  "agil",
  "feroz",
  "resistente",
  "sorrateira",
  "veloz",
];

export const TIER_LABELS: Record<TierFormaSelvagem, string> = {
  base: "Base",
  apr: "Aprimorada",
  sup: "Superior",
};

export const FORMA_LABELS: Record<FormaSelvagemId, string> = {
  agil: "Forma Ágil",
  feroz: "Forma Feroz",
  resistente: "Forma Resistente",
  sorrateira: "Forma Sorrateira",
  veloz: "Forma Veloz",
};
