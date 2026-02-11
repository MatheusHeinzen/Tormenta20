import type { CharacterSheet } from "@/lib/models/character";

export interface CharacterRepository {
  listCharacters(): Promise<CharacterSheet[]>;
  getCharacter(id: string): Promise<CharacterSheet | undefined>;
  saveCharacter(sheet: CharacterSheet): Promise<CharacterSheet>;
  deleteCharacter(id: string): Promise<void>;
}

export class LocalCharacterRepository implements CharacterRepository {
  async listCharacters(): Promise<CharacterSheet[]> {
    const { listCharacters } = await import("./characterStorage");
    return listCharacters();
  }

  async getCharacter(id: string): Promise<CharacterSheet | undefined> {
    const { getCharacter } = await import("./characterStorage");
    return getCharacter(id);
  }

  async saveCharacter(sheet: CharacterSheet): Promise<CharacterSheet> {
    const { saveCharacter } = await import("./characterStorage");
    return saveCharacter(sheet);
  }

  async deleteCharacter(id: string): Promise<void> {
    const { deleteCharacter } = await import("./characterStorage");
    deleteCharacter(id);
  }
}

