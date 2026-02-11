import { useEffect, useMemo, useState } from "react";
import type {
  AbilityScoreName,
  CharacterSheet,
} from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";
import { getRaceAbilityBonusByName } from "@/lib/t20/race";

const ABILITIES_IN_ORDER: AbilityScoreName[] = [
  "forca",
  "destreza",
  "constituicao",
  "inteligencia",
  "sabedoria",
  "carisma",
];

const LABELS: Record<AbilityScoreName, string> = {
  forca: "Força",
  destreza: "Destreza",
  constituicao: "Constituição",
  inteligencia: "Inteligência",
  sabedoria: "Sabedoria",
  carisma: "Carisma",
};

const BASE_POINTS = 10;

function clampBaseMod(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(-1, Math.min(4, value));
}

function costForBaseMod(mod: number): number {
  switch (mod) {
    case -1:
      return -1;
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 4;
    case 4:
      return 7;
    default:
      return 999;
  }
}

interface AttributesCalculatorModalProps {
  open: boolean;
  sheet: CharacterSheet;
  onOpenChange(open: boolean): void;
  onApply(next: CharacterSheet): void;
}

type ModsState = Record<AbilityScoreName, number>;

export function AttributesCalculatorModal({
  open,
  sheet,
  onOpenChange,
  onApply,
}: AttributesCalculatorModalProps) {
  const [baseMods, setBaseMods] = useState<ModsState>(() =>
    buildInitialBaseMods(sheet),
  );
  const [bonusMods, setBonusMods] = useState<ModsState>(() =>
    buildEmptyMods(),
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setBaseMods(buildInitialBaseMods(sheet));
    setBonusMods(buildEmptyMods());
  }, [open, sheet]);

  const raceMods: ModsState = useMemo(() => buildRaceMods(sheet), [sheet]);

  const { totalCost, overLimit } = useMemo(() => {
    const cost = ABILITIES_IN_ORDER.reduce((sum, key) => {
      return sum + costForBaseMod(baseMods[key]);
    }, 0);

    return {
      totalCost: cost,
      overLimit: cost > BASE_POINTS,
    };
  }, [baseMods]);

  if (!open) {
    return null;
  }

  function handleChangeBaseMod(name: AbilityScoreName, value: number) {
    setBaseMods((prev) => ({
      ...prev,
      [name]: clampBaseMod(value),
    }));
  }

  function handleChangeBonusMod(name: AbilityScoreName, value: number) {
    setBonusMods((prev) => ({
      ...prev,
      [name]: Number.isNaN(value) ? 0 : value,
    }));
  }

  function handleApply() {
    if (overLimit) {
      return;
    }

    const nextAtributos = { ...sheet.atributos };

    for (const ability of ABILITIES_IN_ORDER) {
      const totalMod =
        baseMods[ability] + raceMods[ability] + bonusMods[ability];
      const rawScore = Math.max(1, Math.min(30, 10 + 2 * totalMod));
      nextAtributos[ability] = rawScore;
    }

    onApply({
      ...sheet,
      atributos: nextAtributos,
    });
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">
            Compra de atributos (Tormenta 20)
          </h2>
          <button
            type="button"
            className="rounded px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </button>
        </header>

        <p className="mb-4 text-xs text-zinc-600">
          Todos os atributos começam em 0. Você tem{" "}
          <strong>{BASE_POINTS} pontos</strong> para distribuir. Pode reduzir
          um atributo para −1 para ganhar 1 ponto extra.
        </p>

        <div className="mb-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="px-2 py-1 text-left">Atributo</th>
                <th className="px-2 py-1 text-center">Mod (Compra)</th>
                <th className="px-2 py-1 text-center">Raça</th>
                <th className="px-2 py-1 text-center">Bônus</th>
                <th className="px-2 py-1 text-center">Total</th>
                <th className="px-2 py-1 text-center">Custo</th>
              </tr>
            </thead>
            <tbody>
              {ABILITIES_IN_ORDER.map((ability) => {
                const baseMod = baseMods[ability];
                const raceMod = raceMods[ability];
                const bonusMod = bonusMods[ability];
                const totalMod = baseMod + raceMod + bonusMod;
                const cost = costForBaseMod(baseMod);

                return (
                  <tr key={ability} className="border-b border-zinc-100">
                    <td className="px-2 py-2 text-left font-medium text-zinc-800">
                      {LABELS[ability]}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="number"
                        className="w-16 rounded border border-zinc-300 px-1 py-0.5 text-center text-xs focus:border-zinc-600 focus:outline-none"
                        value={baseMod}
                        min={-1}
                        max={4}
                        onChange={(event) =>
                          handleChangeBaseMod(
                            ability,
                            Number(event.target.value),
                          )
                        }
                      />
                    </td>
                    <td className="px-2 py-2 text-center text-zinc-700">
                      {formatSigned(raceMod)}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="number"
                        className="w-16 rounded border border-zinc-300 px-1 py-0.5 text-center text-xs focus:border-zinc-600 focus:outline-none"
                        value={bonusMod}
                        onChange={(event) =>
                          handleChangeBonusMod(
                            ability,
                            Number(event.target.value),
                          )
                        }
                      />
                    </td>
                    <td className="px-2 py-2 text-center font-medium text-zinc-800">
                      {formatSigned(totalMod)}
                    </td>
                    <td className="px-2 py-2 text-center text-zinc-700">
                      {cost === 0 ? "0" : `${cost} ponto${cost === 1 ? "" : "s"}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span
            className={
              overLimit ? "font-semibold text-red-600" : "text-zinc-700"
            }
          >
            Pontos gastos:{" "}
            <strong>
              {totalCost} / {BASE_POINTS}
            </strong>
            {overLimit && " (acima do limite)"}
          </span>

          <button
            type="button"
            className="rounded bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={overLimit}
            onClick={handleApply}
          >
            Aplicar atributos
          </button>
        </div>
      </div>
    </div>
  );
}

function buildEmptyMods(): ModsState {
  return {
    forca: 0,
    destreza: 0,
    constituicao: 0,
    inteligencia: 0,
    sabedoria: 0,
    carisma: 0,
  };
}

function buildInitialBaseMods(sheet: CharacterSheet): ModsState {
  const raceBonus = getRaceAbilityBonusByName(sheet.raca) ?? {};
  const result: ModsState = buildEmptyMods();

  for (const ability of ABILITIES_IN_ORDER) {
    const currentMod = abilityModifier(sheet.atributos[ability]);
    const raceDelta = raceBonus[ability];
    const raceMod = typeof raceDelta === "number" ? raceDelta : 0;
    const baseMod = clampBaseMod(currentMod - raceMod);
    result[ability] = baseMod;
  }

  return result;
}

function buildRaceMods(sheet: CharacterSheet): ModsState {
  const bonus = getRaceAbilityBonusByName(sheet.raca) ?? {};
  const result: ModsState = buildEmptyMods();

  for (const ability of ABILITIES_IN_ORDER) {
    const value = bonus[ability];
    result[ability] = typeof value === "number" ? value : 0;
  }

  return result;
}

function formatSigned(value: number): string {
  if (value === 0) return "0";
  return value > 0 ? `+${value}` : value.toString();
}

