import { useState } from "react";
import type { CharacterSheet } from "@/lib/models/character";
import { getRacas } from "@/lib/data/tormenta20";
import type { RacaJson } from "@/lib/t20/jsonTypes";

interface PowersTabsBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

type PowersTabId = "raciais" | "origem" | "classes" | "diversos";

const TAB_DEFINITIONS: { id: PowersTabId; label: string }[] = [
  { id: "raciais", label: "Raciais" },
  { id: "origem", label: "Origem" },
  { id: "classes", label: "Classes" },
  { id: "diversos", label: "Diversos" },
];

function findRaceByName(nome: string): RacaJson | undefined {
  if (!nome?.trim()) return undefined;
  const normalized = nome.trim();
  const lower = normalized.toLowerCase();
  const racas = getRacas() as RacaJson[];
  return (
    racas.find((race) => race.nome === normalized) ??
    racas.find((race) => race.nome.toLowerCase() === lower)
  );
}

export function PowersTabsBlock({ sheet }: PowersTabsBlockProps) {
  const [activeTab, setActiveTab] = useState<PowersTabId>("raciais");

  const race =
    sheet.raca && sheet.raca.trim().length > 0
      ? findRaceByName(sheet.raca)
      : undefined;

  function renderRacialPowers() {
    if (!race) {
      return (
        <p className="text-sm text-zinc-600">
          Selecione uma raça no cabeçalho para ver as habilidades raciais.
        </p>
      );
    }

    const poderes = race.poderes_automaticos ?? [];

    if (poderes.length === 0) {
      return (
        <p className="text-sm text-zinc-600">
          Esta raça ainda não tem poderes raciais detalhados no sistema. Use a
          aba &quot;Anotações&quot; para registrar manualmente.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {race.descricao_resumida && (
          <p className="text-sm text-zinc-700">{race.descricao_resumida}</p>
        )}

        <ul className="space-y-2">
          {poderes.map((poder) => (
            <li key={poder.id} className="rounded border border-zinc-200 bg-zinc-50 p-2">
              <p className="text-sm font-semibold text-zinc-900">
                {poder.nome}
              </p>
              {poder.descricao_resumida && (
                <p className="text-xs text-zinc-700">
                  {poder.descricao_resumida}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function renderPlaceholder(label: string) {
    return (
      <p className="text-sm text-zinc-600">
        A aba <span className="font-semibold">{label}</span> ainda não está
        ligada automaticamente aos dados. Por enquanto, use a aba
        &nbsp;&quot;Anotações&quot; para registrar esses poderes.
      </p>
    );
  }

  let content: JSX.Element;

  if (activeTab === "raciais") {
    content = renderRacialPowers();
  } else if (activeTab === "origem") {
    content = renderPlaceholder("Origem");
  } else if (activeTab === "classes") {
    content = renderPlaceholder("Classes");
  } else {
    content = renderPlaceholder("Diversos");
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900">
          Poderes e Habilidades
        </h2>
      </div>

      <div className="border-b border-zinc-200">
        <nav className="-mb-px flex gap-2 text-sm">
          {TAB_DEFINITIONS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={
                  "border-b-2 px-3 py-1.5 text-xs font-medium transition-colors " +
                  (isActive
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-800")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div>{content}</div>
    </section>
  );
}

