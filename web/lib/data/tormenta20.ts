import racasJson from "@/data/tormenta20/racas.json";
import classesJson from "@/data/tormenta20/classes.json";
import origensJson from "@/data/tormenta20/origens.json";
import deusesJson from "@/data/tormenta20/deuses.json";
import periciasJson from "@/data/tormenta20/pericias.json";
import type { AbilityScoreName } from "@/lib/models/character";

export interface SimpleOption {
  id: string;
  nome: string;
}

export type RaceOption = SimpleOption;
export type ClassOption = SimpleOption;
export type OriginOption = SimpleOption;
export type DeityOption = SimpleOption;

export function getRacas(): RaceOption[] {
  return racasJson;
}

export function getClasses(): ClassOption[] {
  return classesJson;
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

