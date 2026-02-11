import type { CharacterSheet } from "@/lib/models/character";

const STORAGE_KEY = "t20:characters:v1";

function hasBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readAllInternal(): CharacterSheet[] {
  if (!hasBrowserStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as CharacterSheet[];
  } catch {
    return [];
  }
}

function writeAllInternal(characters: CharacterSheet[]): void {
  if (!hasBrowserStorage()) {
    return;
  }

  try {
    const serialized = JSON.stringify(characters);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // silenciosamente ignorar falhas de escrita (quota cheia, modo privado etc.)
  }
}

export function listCharacters(): CharacterSheet[] {
  return readAllInternal();
}

export function getCharacter(id: string): CharacterSheet | undefined {
  return readAllInternal().find((character) => character.id === id);
}

export function saveCharacter(sheet: CharacterSheet): CharacterSheet {
  const all = readAllInternal();
  const now = new Date().toISOString();

  const existingIndex = all.findIndex((c) => c.id === sheet.id);
  const updated: CharacterSheet = {
    ...sheet,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    all[existingIndex] = updated;
  } else {
    all.push(updated);
  }

  writeAllInternal(all);
  return updated;
}

export function deleteCharacter(id: string): void {
  const all = readAllInternal();
  const filtered = all.filter((character) => character.id !== id);
  if (filtered.length === all.length) {
    return;
  }

  writeAllInternal(filtered);
}

