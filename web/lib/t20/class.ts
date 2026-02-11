import type {
  AbilityScores,
  CharacterClass,
  CharacterSheet,
} from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";

interface ClassRule {
  nome: string;
  pvNivel1: number;
  pvPorNivel: number;
  pmPorNivel: number;
}

// Regras de PV/PM por nível (livro básico T20 / T20 SRD).
// 1º nível: pvNivel1 + mod. Constituição; níveis seguintes: pvPorNivel + mod. Con cada.
// PM: valor fixo por nível de classe (sem modificador de atributo na base).
const CLASS_RULES: ClassRule[] = [
  { nome: "Arcanista", pvNivel1: 8, pvPorNivel: 2, pmPorNivel: 6 },
  { nome: "Bárbaro", pvNivel1: 24, pvPorNivel: 6, pmPorNivel: 3 },
  { nome: "Bardo", pvNivel1: 12, pvPorNivel: 3, pmPorNivel: 4 },
  { nome: "Bucaneiro", pvNivel1: 16, pvPorNivel: 4, pmPorNivel: 3 },
  { nome: "Caçador", pvNivel1: 16, pvPorNivel: 4, pmPorNivel: 4 },
  { nome: "Cavaleiro", pvNivel1: 20, pvPorNivel: 5, pmPorNivel: 3 },
  { nome: "Clérigo", pvNivel1: 16, pvPorNivel: 4, pmPorNivel: 4 },
  { nome: "Druida", pvNivel1: 16, pvPorNivel: 4, pmPorNivel: 4 },
  { nome: "Guerreiro", pvNivel1: 20, pvPorNivel: 5, pmPorNivel: 3 },
  { nome: "Inventor", pvNivel1: 12, pvPorNivel: 3, pmPorNivel: 4 },
  { nome: "Ladino", pvNivel1: 12, pvPorNivel: 3, pmPorNivel: 4 },
  { nome: "Lutador", pvNivel1: 20, pvPorNivel: 5, pmPorNivel: 3 },
  { nome: "Nobre", pvNivel1: 16, pvPorNivel: 4, pmPorNivel: 4 },
  { nome: "Paladino", pvNivel1: 20, pvPorNivel: 5, pmPorNivel: 3 },
];

function findClassRule(nomeClasse: string): ClassRule | undefined {
  return CLASS_RULES.find((rule) => rule.nome === nomeClasse);
}

/**
 * PV de uma classe. Em multiclasse, só a classe do 1º nível do personagem
 * usa pvNivel1; ao ganhar nível em outra classe, usa-se pvPorNivel (nível
 * subsequente), não o valor de 1º nível dessa classe.
 * @param isPrimeiraClasse true = classe do 1º nível do personagem (usa pvNivel1 no 1º nível)
 */
function calcularPvClasse(
  klass: CharacterClass,
  atributos: AbilityScores,
  isPrimeiraClasse: boolean,
): number {
  const rule = findClassRule(klass.nome);
  if (!rule || klass.nivel <= 0) return 0;

  const modCon = abilityModifier(atributos.constituicao);

  let total: number;
  if (isPrimeiraClasse) {
    const primeiroNivel = rule.pvNivel1 + modCon;
    const niveisSubsequentes = klass.nivel - 1;
    const porNivel =
      niveisSubsequentes > 0
        ? niveisSubsequentes * (rule.pvPorNivel + modCon)
        : 0;
    total = primeiroNivel + porNivel;
  } else {
    total = klass.nivel * (rule.pvPorNivel + modCon);
  }

  return Math.max(1, total);
}

function calcularPmClasse(klass: CharacterClass): number {
  const rule = findClassRule(klass.nome);
  if (!rule || klass.nivel <= 0) return 0;

  // PM em Tormenta 20, de modo geral, são um valor fixo por nível
  // de classe (sem modificador de atributo).
  return klass.nivel * rule.pmPorNivel;
}

export function applyClassRules(sheet: CharacterSheet): CharacterSheet {
  const classes = sheet.classes;

  if (!classes || classes.length === 0) {
    return sheet;
  }

  const totalPv = classes
    .map((klass, index) =>
      calcularPvClasse(klass, sheet.atributos, index === 0),
    )
    .reduce((total, pv) => total + pv, 0);

  const totalPm = classes
    .map((klass) => calcularPmClasse(klass))
    .reduce((total, pm) => total + pm, 0);

  // Mantemos os valores atuais de PV/PM atual. Apenas ajustamos o
  // máximo, e garantimos que o atual não ultrapasse o máximo.
  const pvMaximo = totalPv > 0 ? totalPv : sheet.combate.pvMaximo;
  const pmMaximo = totalPm > 0 ? totalPm : sheet.combate.pmMaximo;

  const pvAtual = Math.min(sheet.combate.pvAtual, pvMaximo);
  const pmAtual = Math.min(sheet.combate.pmAtual, pmMaximo);

  return {
    ...sheet,
    combate: {
      ...sheet.combate,
      pvMaximo,
      pmMaximo,
      pvAtual,
      pmAtual,
    },
  };
}

