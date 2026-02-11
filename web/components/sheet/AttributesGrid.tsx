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
    <section className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900">Atributos</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(LABELS) as AbilityScoreName[]).map((key) => {
          const score = sheet.atributos[key];
          const mod = abilityModifier(score);

          return (
            <div
              key={key}
              className="flex flex-col items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-center"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                {LABELS[key]}
              </span>
              <input
                type="number"
                min={1}
                className="mt-2 w-16 rounded border border-zinc-300 px-2 py-1 text-center text-sm font-semibold shadow-sm focus:border-zinc-600 focus:outline-none"
                value={score}
                onChange={(event) =>
                  handleChange(key, Number(event.target.value) || 0)
                }
              />
              <span className="mt-1 text-[11px] text-zinc-600">
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

