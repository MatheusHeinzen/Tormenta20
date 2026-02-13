import type {
  AbilityScoreName,
  AbilityScores,
  CharacterClass,
  CharacterSheet,
} from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";
import { getClassByNome, getLinhagemById } from "@/lib/data/tormenta20";
import type { MagiaClasseJson, RegrasMagiaCaminho } from "@/lib/t20/jsonTypes";

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
 * PV de uma classe. Usa o modificador do atributo definido em atributoHp
 * (por padrão Constituição). Em multiclasse, só a classe do 1º nível usa
 * pvNivel1; níveis seguintes usam pvPorNivel.
 * @param isPrimeiraClasse true = classe do 1º nível do personagem (usa pvNivel1 no 1º nível)
 */
function calcularPvClasse(
  klass: CharacterClass,
  atributos: AbilityScores,
  atributoHp: AbilityScoreName,
  isPrimeiraClasse: boolean,
): number {
  const rule = findClassRule(klass.nome);
  if (!rule || klass.nivel <= 0) return 0;

  const modHp = abilityModifier(atributos[atributoHp]);

  let total: number;
  if (isPrimeiraClasse) {
    const primeiroNivel = rule.pvNivel1 + modHp;
    const niveisSubsequentes = klass.nivel - 1;
    const porNivel =
      niveisSubsequentes > 0
        ? niveisSubsequentes * (rule.pvPorNivel + modHp)
        : 0;
    total = primeiroNivel + porNivel;
  } else {
    total = klass.nivel * (rule.pvPorNivel + modHp);
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

function bonusPvLinhagemFeiticeiro(
  sheet: CharacterSheet,
  primeiraClasse: CharacterClass,
): number {
  const data = getClassByNome(primeiraClasse.nome);
  if (data?.id !== "arcanista" || primeiraClasse.caminho !== "feiticeiro" || !primeiraClasse.linhagem) {
    return 0;
  }
  const linhagem = getLinhagemById(primeiraClasse.linhagem);
  if (!linhagem?.efeitos_mecanicos?.length) return 0;
  const efeito = linhagem.efeitos_mecanicos.find(
    (e) => e.condicao === "vida_inicial_soma_atributo" && e.atributo,
  );
  if (!efeito?.atributo) return 0;
  return abilityModifier(sheet.atributos[efeito.atributo]);
}

export function applyClassRules(sheet: CharacterSheet): CharacterSheet {
  const classes = sheet.classes;

  if (!classes || classes.length === 0) {
    return sheet;
  }

  const atributoHp: AbilityScoreName =
    sheet.config?.derived?.atributoHp ?? "constituicao";

  let totalPv = classes
    .map((klass, index) =>
      calcularPvClasse(klass, sheet.atributos, atributoHp, index === 0),
    )
    .reduce((total, pv) => total + pv, 0);

  const bonusLinhagem = bonusPvLinhagemFeiticeiro(sheet, classes[0]);
  if (bonusLinhagem !== 0) totalPv += bonusLinhagem;

  const totalPm = classes
    .map((klass) => calcularPmClasse(klass))
    .reduce((total, pm) => total + pm, 0);

  const pvMaximo = totalPv > 0 ? totalPv : sheet.combate.pvMaximo;
  const pmMaximo = totalPm > 0 ? totalPm : sheet.combate.pmMaximo;

  return {
    ...sheet,
    combate: {
      ...sheet.combate,
      pvMaximo,
      pmMaximo,
    },
  };
}

const LABEL_ARMAS: Record<string, string> = {
  simples: "Simples",
  marciais: "Marciais",
  exoticas: "Exóticas",
  deFogo: "De fogo",
};
const LABEL_ARMADURAS: Record<string, string> = {
  leves: "Leves",
  medias: "Médias",
  pesadas: "Pesadas",
};
const LABEL_ESCUDOS: Record<string, string> = {
  leves: "Leves",
  pesados: "Pesados",
};

export interface ConjuradorMagiaInfo {
  atributoChave: AbilityScoreName | null;
  atributoLabel: string;
  circuloMax: number;
  cdBase: number;
  bonusTeste: number;
  magiasConhecidas: number;
  nivelTotal: number;
  memorizaMetade: boolean;
  maxMemorizadas: number;
}

export function getConjuradorMagiaInfo(sheet: CharacterSheet): ConjuradorMagiaInfo | null {
  const classes = sheet.classes ?? [];
  let magiaData: MagiaClasseJson | undefined;
  let conjuradorClass: CharacterClass | undefined;
  let classDataId: string | undefined;
  for (const klass of classes) {
    const data = getClassByNome(klass.nome);
    if (data?.magia?.conjurador) {
      magiaData = data.magia;
      conjuradorClass = klass;
      classDataId = data.id;
      break;
    }
  }
  if (!magiaData) return null;

  const nivelTotal = classes.reduce((acc, k) => acc + k.nivel, 0);
  if (nivelTotal <= 0) return null;

  const progressao = magiaData.progressao_circulos ?? [];
  const circuloMax = progressao
    .filter((p) => p.nivel_personagem <= nivelTotal)
    .reduce((max, p) => Math.max(max, p.circulo), 0) || 1;

  const caminho = classDataId === "arcanista" ? conjuradorClass?.caminho : undefined;
  const atributoChave =
    magiaData.atributo_chave_por_caminho && caminho
      ? magiaData.atributo_chave_por_caminho[caminho]
      : magiaData.atributo_chave ?? null;
  const atributoLabel = atributoChave
    ? (atributoChave === "carisma"
        ? "Carisma"
        : atributoChave === "sabedoria"
          ? "Sabedoria"
          : atributoChave === "inteligencia"
            ? "Inteligência"
            : String(atributoChave))
    : "Int/Car (caminho)";
  const modAttr = atributoChave
    ? abilityModifier(sheet.atributos[atributoChave])
    : 0;
  const cdBase = 10 + Math.ceil(nivelTotal / 2) + modAttr;
  const bonusTeste = modAttr + nivelTotal;

  const regrasCaminho: RegrasMagiaCaminho | undefined =
    caminho && magiaData.regras_por_caminho
      ? magiaData.regras_por_caminho[caminho]
      : undefined;
  const iniciais = regrasCaminho?.magias_iniciais ?? magiaData.magias_iniciais ?? 0;
  const regra = regrasCaminho?.magias_por_nivel ?? magiaData.magias_por_nivel ?? "";

  let magiasConhecidas = iniciais;
  if (regra === "1_por_nivel") {
    magiasConhecidas += nivelTotal - 1;
  } else if (regra === "1_niveis_pares") {
    magiasConhecidas += Math.floor((nivelTotal - 1) / 2);
  } else if (regra === "1_niveis_impares") {
    magiasConhecidas += Math.floor((nivelTotal - 1) / 2);
  } else if (regra === "1_por_novo_circulo") {
    const circulosDesbloqueados = progressao.filter((p) => p.nivel_personagem <= nivelTotal).length;
    magiasConhecidas = iniciais + Math.max(0, circulosDesbloqueados - 1);
  }

  const memorizaMetade = !!regrasCaminho?.memoriza_metade;
  const maxMemorizadas = memorizaMetade ? Math.ceil(magiasConhecidas / 2) : 0;

  return {
    atributoChave,
    atributoLabel,
    circuloMax,
    cdBase,
    bonusTeste,
    magiasConhecidas,
    nivelTotal,
    memorizaMetade,
    maxMemorizadas,
  };
}

function joinProficiencia(list: string[] | undefined, labels: Record<string, string>): string {
  if (!list?.length) return "";
  return list.map((k) => labels[k] ?? k).join(", ");
}

/**
 * Atualiza as flags de proficiência do sheet com base nas classes do personagem.
 * Faz união: se qualquer classe concede uma proficiência, a flag fica true.
 */
export function applyClassProficiencies(sheet: CharacterSheet): CharacterSheet {
  const classes = sheet.classes;
  if (!classes?.length) return sheet;

  let armasSimples = sheet.proficiencias.armas.simples;
  let armasMarciais = sheet.proficiencias.armas.marciais;
  let armasExoticas = sheet.proficiencias.armas.exoticas;
  let armasDeFogo = sheet.proficiencias.armas.deFogo;
  const armadurasSet = new Set<string>();
  const escudosSet = new Set<string>();

  for (const klass of classes) {
    const data = getClassByNome(klass.nome);
    if (!data?.proficiencias) continue;
    const p = data.proficiencias;
    if (p.armas) {
      for (const a of p.armas) {
        if (a === "simples") armasSimples = true;
        if (a === "marciais") armasMarciais = true;
        if (a === "exoticas" || a === "exóticas") armasExoticas = true;
        if (a === "de_fogo" || a === "deFogo") armasDeFogo = true;
      }
    }
    if (p.armaduras) p.armaduras.forEach((x) => armadurasSet.add(x));
    if (p.escudos) p.escudos.forEach((x) => escudosSet.add(x));
  }

  const armaduraProficiencia =
    joinProficiencia([...armadurasSet], LABEL_ARMADURAS) ||
    sheet.proficiencias.armadura.proficiencia;
  const escudoProficiencia =
    joinProficiencia([...escudosSet], LABEL_ESCUDOS) ||
    sheet.proficiencias.escudo.proficiencia;

  return {
    ...sheet,
    proficiencias: {
      ...sheet.proficiencias,
      armas: {
        ...sheet.proficiencias.armas,
        simples: armasSimples,
        marciais: armasMarciais,
        exoticas: armasExoticas,
        deFogo: armasDeFogo,
      },
      armadura: {
        ...sheet.proficiencias.armadura,
        proficiencia: armaduraProficiencia,
      },
      escudo: {
        ...sheet.proficiencias.escudo,
        proficiencia: escudoProficiencia,
      },
    },
  };
}

