import type { AbilityScoreName, CharacterSheet } from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";

interface AttributesGridProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

const LABELS: Record<AbilityScoreName, string> = {
  forca: "Força",
  destreza: "Destreza",
  constituicao: "Constituição",
  inteligencia: "Inteligência",
  sabedoria: "Sabedoria",
  carisma: "Carisma",
};

export function AttributesGrid({ sheet, onChange }: AttributesGridProps) {
  function handleChange(name: AbilityScoreName, value: number) {
    onChange({
      ...sheet,
      atributos: {
        ...sheet.atributos,
        [name]: value,
      },
    });
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Atributos</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {(Object.keys(LABELS) as AbilityScoreName[]).map((key) => {
          const score = sheet.atributos[key];
          const mod = abilityModifier(score);

          return (
            <div
              key={key}
              className="flex flex-col items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-3 text-center"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {LABELS[key]}
              </span>
              <input
                type="number"
                min={1}
                className="mt-1 w-16 rounded border border-zinc-300 px-2 py-1 text-center text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                value={score}
                onChange={(event) =>
                  handleChange(key, Number(event.target.value) || 0)
                }
              />
              <span className="mt-1 text-xs text-zinc-600">
                Modificador:{" "}
                <strong>{mod >= 0 ? `+${mod}` : mod.toString()}</strong>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

