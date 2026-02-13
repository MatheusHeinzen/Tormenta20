import racasJson from "@/data/tormenta20/racas.json";
import classesJson from "@/data/tormenta20/classes.json";
import poderesClasseJson from "@/data/tormenta20/poderes_classe.json";
import origensJson from "@/data/tormenta20/origens.json";
import deusesJson from "@/data/tormenta20/deuses.json";
import poderesConcedidosJson from "@/data/tormenta20/poderes_concedidos.json";
import periciasJson from "@/data/tormenta20/pericias.json";
import linhagensJson from "@/data/tormenta20/linhagens.json";
import type { AbilityScoreName } from "@/lib/models/character";
import type {
  ClasseJson,
  DivindadeJson,
  LinhagemJson,
  OrigemJson,
  PoderClasseJson,
  PoderConcedidoDivindadeJson,
  RacaJson,
} from "@/lib/t20/jsonTypes";

export interface SimpleOption {
  id: string;
  nome: string;
}

export type RaceOption = RacaJson;
export type ClassOption = ClasseJson;
export type OriginOption = SimpleOption;
export type DeityOption = SimpleOption;

export function getRacas(): RaceOption[] {
  return racasJson as RaceOption[];
}

export function getClasses(): ClassOption[] {
  return classesJson as ClassOption[];
}

export function getClassByNome(nome: string): ClasseJson | undefined {
  if (!nome?.trim()) return undefined;
  const n = nome.trim();
  return (classesJson as ClasseJson[]).find(
    (c) => c.nome === n || c.nome.toLowerCase() === n.toLowerCase(),
  );
}

export function getPoderesClasse(): PoderClasseJson[] {
  return poderesClasseJson as PoderClasseJson[];
}

export function getPoderesClasseByIds(ids: string[]): PoderClasseJson[] {
  const todos = getPoderesClasse();
  return ids.map((id) => todos.find((p) => p.id === id)).filter(Boolean) as PoderClasseJson[];
}

export function getOrigens(): OriginOption[] {
  return origensJson;
}

export function getOrigemByNome(nome: string): OrigemJson | undefined {
  if (!nome?.trim()) return undefined;
  const n = nome.trim();
  return (origensJson as OrigemJson[]).find(
    (o) => o.nome === n || o.nome.toLowerCase() === n.toLowerCase(),
  );
}

export function getDeuses(): DeityOption[] {
  return deusesJson;
}

export function getDeusByNome(nome: string): DivindadeJson | undefined {
  if (!nome?.trim()) return undefined;
  const n = nome.trim();
  const list = deusesJson as DivindadeJson[];
  return (
    list.find((d) => d.nome === n) ??
    list.find((d) => d.nome.toLowerCase() === n.toLowerCase())
  );
}

export function getPoderesConcedidos(): PoderConcedidoDivindadeJson[] {
  return poderesConcedidosJson as PoderConcedidoDivindadeJson[];
}

export function getPoderesConcedidosByIds(
  ids: string[],
): PoderConcedidoDivindadeJson[] {
  const todos = getPoderesConcedidos();
  return ids
    .map((id) => todos.find((p) => p.id === id))
    .filter(Boolean) as PoderConcedidoDivindadeJson[];
}

export function getPoderesConcedidosPorDivindade(
  divindadeNomeOuId: string,
): PoderConcedidoDivindadeJson[] {
  if (!divindadeNomeOuId?.trim()) return [];
  const list = deusesJson as DivindadeJson[];
  const deus =
    list.find(
      (d) =>
        d.nome === divindadeNomeOuId.trim() ||
        d.id === divindadeNomeOuId.trim().toLowerCase(),
    ) ?? list.find((d) => d.nome.toLowerCase() === divindadeNomeOuId.trim().toLowerCase());
  const ids = deus?.poderes_concedidos ?? [];
  return getPoderesConcedidosByIds(ids);
}

export function getLinhagens(): LinhagemJson[] {
  return linhagensJson as LinhagemJson[];
}

export function getLinhagemById(id: string): LinhagemJson | undefined {
  if (!id?.trim()) return undefined;
  return (linhagensJson as LinhagemJson[]).find(
    (l) => l.id === id || l.id.toLowerCase() === id.toLowerCase(),
  );
}

export type SkillId = (typeof periciasJson)[number]["id"];

export interface SkillRule {
  id: SkillId;
  nome: string;
  atributoPadrao: AbilityScoreName;
}

export const skillRules: SkillRule[] = periciasJson as SkillRule[];

