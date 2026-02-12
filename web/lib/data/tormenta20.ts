import racasJson from "@/data/tormenta20/racas.json";
import classesJson from "@/data/tormenta20/classes.json";
import poderesClasseJson from "@/data/tormenta20/poderes_classe.json";
import origensJson from "@/data/tormenta20/origens.json";
import deusesJson from "@/data/tormenta20/deuses.json";
import periciasJson from "@/data/tormenta20/pericias.json";
import type { AbilityScoreName } from "@/lib/models/character";
import type { ClasseJson, PoderClasseJson, RacaJson } from "@/lib/t20/jsonTypes";

export interface SimpleOption {
  id: string;
  nome: string;
}

export type RaceOption = RacaJson;
export type ClassOption = ClasseJson;
export type OriginOption = SimpleOption;
export type DeityOption = SimpleOption;

export function getRacas(): RaceOption[] {
  return racasJson;
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

export function getDeuses(): DeityOption[] {
  return deusesJson;
}

export type SkillId = (typeof periciasJson)[number]["id"];

export interface SkillRule {
  id: SkillId;
  nome: string;
  atributoPadrao: AbilityScoreName;
}

export const skillRules: SkillRule[] = periciasJson;

