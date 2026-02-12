import { useState } from "react";
import type { CharacterSheet } from "@/lib/models/character";
import {
  getClassByNome,
  getOrigemByNome,
  getPoderesClasseByIds,
  getRacas,
} from "@/lib/data/tormenta20";
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

  function renderClassPowers() {
    const classes = sheet.classes ?? [];

    if (classes.length === 0) {
      return (
        <p className="text-sm text-zinc-600">
          Adicione ao menos uma classe na aba{" "}
          <span className="font-semibold">Básico</span> para ver os poderes de
          classe aqui.
        </p>
      );
    }

    const blocks = classes
      .map((klass) => {
        const data = getClassByNome(klass.nome);
        if (!data) return null;

        const habilidadesPorNivel = data.habilidades_por_nivel ?? [];
        const poderesIds = habilidadesPorNivel.flatMap((h) => h.poderes);
        const poderes = getPoderesClasseByIds(poderesIds);

        return {
          id: data.id,
          nome: data.nome,
          nivel: klass.nivel,
          descricao: data.descricao_resumida,
          poderesPorNivel: habilidadesPorNivel.map((h) => ({
            nivel: h.nivel,
            poderes: getPoderesClasseByIds(h.poderes),
          })),
        };
      })
      .filter(Boolean) as {
      id: string;
      nome: string;
      nivel: number;
      descricao?: string;
      poderesPorNivel: { nivel: number; poderes: ReturnType<
        typeof getPoderesClasseByIds
      > }[];
    }[];

    if (blocks.length === 0) {
      return (
        <p className="text-sm text-zinc-600">
          As classes cadastradas ainda não têm poderes de classe detalhados no
          JSON. Use a aba &quot;Anotações&quot; para registrar manualmente.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900">
                {block.nome}{" "}
                <span className="text-xs font-normal text-zinc-500">
                  (nível {block.nivel})
                </span>
              </p>
            </div>
            {block.descricao && (
              <p className="text-xs text-zinc-700">{block.descricao}</p>
            )}
            {block.poderesPorNivel.length > 0 ? (
              <ul className="space-y-1">
                {block.poderesPorNivel.map((grupo) => (
                  <li key={grupo.nivel} className="text-xs text-zinc-800">
                    <span className="font-semibold">Nível {grupo.nivel}:</span>{" "}
                    {grupo.poderes.length === 0 ? (
                      <span className="text-zinc-500">
                        (sem poderes cadastrados)
                      </span>
                    ) : (
                      grupo.poderes.map((poder, idx) => (
                        <span key={poder.id}>
                          {idx > 0 && ", "}
                          <span className="font-semibold">{poder.nome}</span>
                          {poder.descricao_resumida
                            ? ` — ${poder.descricao_resumida}`
                            : ""}
                        </span>
                      ))
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-600">
                Nenhum poder de classe cadastrado para esta classe.
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  function renderOriginPowers() {
    const origem =
      sheet.origem && sheet.origem.trim().length > 0
        ? getOrigemByNome(sheet.origem)
        : undefined;

    if (!origem) {
      return (
        <p className="text-sm text-zinc-600">
          Selecione uma origem no cabeçalho para ver os poderes.
        </p>
      );
    }

    const poderes = origem.poderes ?? [];

    if (poderes.length === 0) {
      return (
        <p className="text-sm text-zinc-600">
          Esta origem não tem poderes listados no sistema.
        </p>
      );
    }

    return (
      <ul className="space-y-2">
        {poderes.map((nome) => (
          <li
            key={nome}
            className="rounded border border-zinc-200 bg-zinc-50 p-2"
          >
            <p className="text-sm font-semibold text-zinc-900">{nome}</p>
          </li>
        ))}
      </ul>
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
    content = renderOriginPowers();
  } else if (activeTab === "classes") {
    content = renderClassPowers();
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

