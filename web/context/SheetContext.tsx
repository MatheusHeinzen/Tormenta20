'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  type CharacterSheet,
  createEmptyCharacterSheet,
  normalizeCharacter,
  syncClassesToLegacyFields,
} from "@/lib/models/character";
import {
  deleteCharacter as deleteFromStorage,
  listCharacters,
  saveCharacter,
} from "@/lib/storage/characterStorage";

interface SheetState {
  characters: CharacterSheet[];
  currentId?: string;
  loading: boolean;
}

type SheetAction =
  | { type: "LOAD_FROM_STORAGE"; payload: CharacterSheet[] }
  | { type: "SET_CURRENT"; payload: string | undefined }
  | { type: "UPSERT"; payload: CharacterSheet }
  | { type: "DELETE"; payload: string };

const initialState: SheetState = {
  characters: [],
  currentId: undefined,
  loading: true,
};

function reducer(state: SheetState, action: SheetAction): SheetState {
  switch (action.type) {
    case "LOAD_FROM_STORAGE":
      return {
        ...state,
        characters: action.payload,
        loading: false,
      };
    case "SET_CURRENT":
      return {
        ...state,
        currentId: action.payload,
      };
    case "UPSERT": {
      const exists = state.characters.some(
        (character) => character.id === action.payload.id,
      );

      const characters = exists
        ? state.characters.map((character) =>
            character.id === action.payload.id ? action.payload : character,
          )
        : [...state.characters, action.payload];

      return {
        ...state,
        characters,
        currentId: action.payload.id,
      };
    }
    case "DELETE":
      return {
        ...state,
        characters: state.characters.filter(
          (character) => character.id !== action.payload,
        ),
        currentId:
          state.currentId === action.payload ? undefined : state.currentId,
      };
    default:
      return state;
  }
}

interface SheetContextValue {
  characters: CharacterSheet[];
  current?: CharacterSheet;
  loading: boolean;
  setCurrent(id: string | undefined): void;
  createCharacter(nome: string): CharacterSheet;
  updateCharacter(sheet: CharacterSheet): CharacterSheet;
  deleteCharacter(id: string): void;
}

const SheetContext = createContext<SheetContextValue | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stored = listCharacters();
    const normalized = stored.map((sheet) => normalizeCharacter(sheet));
    dispatch({ type: "LOAD_FROM_STORAGE", payload: normalized });
  }, []);

  const value: SheetContextValue = useMemo(() => {
    const current = state.characters.find(
      (character) => character.id === state.currentId,
    );

    function setCurrent(id: string | undefined) {
      dispatch({ type: "SET_CURRENT", payload: id });
    }

    function createCharacter(nome: string): CharacterSheet {
      const fresh = createEmptyCharacterSheet(nome);
      const prepared = syncClassesToLegacyFields(normalizeCharacter(fresh));
      const saved = saveCharacter(prepared);
      dispatch({ type: "UPSERT", payload: saved });
      return saved;
    }

    function updateCharacter(sheet: CharacterSheet): CharacterSheet {
      const prepared = syncClassesToLegacyFields(normalizeCharacter(sheet));
      const saved = saveCharacter(prepared);
      dispatch({ type: "UPSERT", payload: saved });
      return saved;
    }

    function deleteCharacter(id: string): void {
      deleteFromStorage(id);
      dispatch({ type: "DELETE", payload: id });
    }

    return {
      characters: state.characters,
      current,
      loading: state.loading,
      setCurrent,
      createCharacter,
      updateCharacter,
      deleteCharacter,
    };
  }, [state]);

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

export function useSheetContext(): SheetContextValue {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("useSheetContext deve ser usado dentro de SheetProvider");
  }

  return ctx;
}

