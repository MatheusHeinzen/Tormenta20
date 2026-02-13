import React, { useState } from "react";
import type { CharacterSheet } from "@/lib/models/character";
import {
  getClassByNome,
  getDeusByNome,
  getLinhagemById,
  getOrigemByNome,
  getPoderesClasseByIds,
  getPoderesConcedidos,
  getPoderesConcedidosByIds,
  getPoderesConcedidosPorDivindade,
  getRacas,
} from "@/lib/data/tormenta20";
import type { LinhagemJson, RacaJson } from "@/lib/t20/jsonTypes";

interface PowersTabsBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

type PowersTabId = "raciais" | "origem" | "classes" | "divindade" | "diversos";

const TAB_DEFINITIONS: { id: PowersTabId; label: string }[] = [
  { id: "raciais", label: "Raciais" },
  { id: "origem", label: "Origem" },
  { id: "classes", label: "Classes" },
  { id: "divindade", label: "Divindade" },
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

function hasLinhagemAbencoada(sheet: CharacterSheet): boolean {
  return (sheet.classes ?? []).some(
    (k) =>
      getClassByNome(k.nome)?.id === "arcanista" &&
      k.caminho === "feiticeiro" &&
      k.linhagem === "abencoada",
  );
}

export function PowersTabsBlock({ sheet, onChange }: PowersTabsBlockProps) {
  const [activeTab, setActiveTab] = useState<PowersTabId>("raciais");

  const race =
    sheet.raca && sheet.raca.trim().length > 0
      ? findRaceByName(sheet.raca)
      : undefined;

  function renderRacialPowers() {
    if (!race) {
      return (
        <p className="text-sm text-ink-muted">
          Selecione uma raça no cabeçalho para ver as habilidades raciais.
        </p>
      );
    }

    const poderes = race.poderes_automaticos ?? [];

    if (poderes.length === 0) {
      return (
        <p className="text-sm text-ink-muted">
          Esta raça ainda não tem poderes raciais detalhados no sistema. Use a
          aba &quot;Anotações&quot; para registrar manualmente.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {race.descricao_resumida && (
          <p className="text-sm text-ink">{race.descricao_resumida}</p>
        )}

        <ul className="space-y-2">
          {poderes.map((poder) => (
            <li key={poder.id} className="rounded border border-border bg-paper p-2">
              <p className="text-sm font-semibold text-ink">
                {poder.nome}
              </p>
              {poder.descricao_resumida && (
                <p className="text-xs text-ink">
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
        <p className="text-sm text-ink-muted">
          Adicione ao menos uma classe na aba{" "}
          <span className="font-semibold">Básico</span> para ver os poderes de
          classe aqui.
        </p>
      );
    }

    const LINHAGEM_PODERES_IDS: Record<string, [string, string]> = {
      draconica: ["feiticeiro_linhagem_draconica_aprimorada", "feiticeiro_linhagem_draconica_superior"],
      feerica: ["feiticeiro_linhagem_feerica_aprimorada", "feiticeiro_linhagem_feerica_superior"],
      rubra: ["feiticeiro_linhagem_rubra_aprimorada", "feiticeiro_linhagem_rubra_superior"],
      abencoada: ["feiticeiro_linhagem_abencoada_aprimorada", "feiticeiro_linhagem_abencoada_superior"],
    };

    const blocks = classes
      .map((klass) => {
        const data = getClassByNome(klass.nome);
        if (!data) return null;

        const habilidadesPorNivel = data.habilidades_por_nivel ?? [];
        const poderesIds = habilidadesPorNivel.flatMap((h) => h.poderes);
        const poderes = getPoderesClasseByIds(poderesIds);

        const poderesLinhagemOpcionais =
          data.id === "arcanista" &&
          klass.caminho === "feiticeiro" &&
          klass.linhagem &&
          LINHAGEM_PODERES_IDS[klass.linhagem]
            ? getPoderesClasseByIds(LINHAGEM_PODERES_IDS[klass.linhagem]).filter(
                (p) => (p.requisitos?.nivel_minimo ?? 0) <= klass.nivel,
              )
            : [];

        const linhagemBasica: LinhagemJson | null =
          data.id === "arcanista" &&
          klass.caminho === "feiticeiro" &&
          klass.linhagem
            ? (getLinhagemById(klass.linhagem) ?? null)
            : null;

        return {
          id: data.id,
          nome: data.nome,
          nivel: klass.nivel,
          descricao: data.descricao_resumida,
          poderesPorNivel: habilidadesPorNivel.map((h) => ({
            nivel: h.nivel,
            poderes: getPoderesClasseByIds(h.poderes),
          })),
          poderesLinhagemOpcionais,
          linhagemBasica,
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
      poderesLinhagemOpcionais: ReturnType<typeof getPoderesClasseByIds>;
      linhagemBasica: LinhagemJson | null;
    }[];

    if (blocks.length === 0) {
      return (
        <p className="text-sm text-ink-muted">
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
            className="space-y-2 rounded border border-border bg-paper p-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-ink">
                {block.nome}{" "}
                <span className="text-xs font-normal text-ink-muted">
                  (nível {block.nivel})
                </span>
              </p>
            </div>
            {block.descricao && (
              <p className="text-xs text-ink">{block.descricao}</p>
            )}
            {block.poderesPorNivel.length > 0 ? (
              <ul className="space-y-1">
                {block.poderesPorNivel.map((grupo) => (
                  <li key={grupo.nivel} className="text-xs text-ink">
                    <span className="font-semibold">Nível {grupo.nivel}:</span>{" "}
                    {grupo.poderes.length === 0 ? (
                      <span className="text-ink-muted">
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
              <p className="text-xs text-ink-muted">
                Nenhum poder de classe cadastrado para esta classe.
              </p>
            )}
            {block.linhagemBasica && (
              <div className="mt-2 border-t border-border pt-2">
                <p className="text-[11px] font-semibold uppercase text-ink-muted">
                  Herança básica (1º nível)
                </p>
                <div className="mt-1 rounded border border-border bg-paper-card p-2">
                  <p className="text-xs font-semibold text-ink">
                    {block.linhagemBasica.nome}
                  </p>
                  {block.linhagemBasica.descricao_resumida && (
                    <p className="mt-0.5 text-xs text-ink">
                      {block.linhagemBasica.descricao_resumida}
                    </p>
                  )}
                </div>
              </div>
            )}
            {block.poderesLinhagemOpcionais.length > 0 && (
              <div className="mt-2 border-t border-border pt-2">
                <p className="text-[11px] font-semibold uppercase text-ink-muted">
                  Poderes opcionais de linhagem (escolha em níveis futuros)
                </p>
                <ul className="mt-1 space-y-1 text-xs text-ink">
                  {block.poderesLinhagemOpcionais.map((poder) => (
                    <li key={poder.id}>
                      <span className="font-semibold">{poder.nome}</span>
                      {poder.descricao_resumida
                        ? ` — ${poder.descricao_resumida}`
                        : ""}
                    </li>
                  ))}
                </ul>
              </div>
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
        <p className="text-sm text-ink-muted">
          Selecione uma origem no cabeçalho para ver os poderes.
        </p>
      );
    }

    const poderes = origem.poderes ?? [];

    if (poderes.length === 0) {
      return (
        <p className="text-sm text-ink-muted">
          Esta origem não tem poderes listados no sistema.
        </p>
      );
    }

    return (
      <ul className="space-y-2">
        {poderes.map((nome) => (
          <li
            key={nome}
            className="rounded border border-border bg-paper p-2"
          >
            <p className="text-sm font-semibold text-ink">{nome}</p>
          </li>
        ))}
      </ul>
    );
  }

  function renderDivindadePowers() {
    const divindade = sheet.divindade?.trim();
    if (!divindade) {
      return (
        <p className="text-sm text-ink-muted">
          Selecione uma divindade no cabeçalho para escolher poderes concedidos.
        </p>
      );
    }

    const deus = getDeusByNome(divindade);
    const poderesDaDivindade = getPoderesConcedidosPorDivindade(divindade);
    const idsEscolhidos = sheet.poderesDivindadeIds ?? [];
    const idAbencoada = sheet.poderConcedidoLinhagemAbencoadaId;
    const idsExibidos = idAbencoada
      ? [...idsEscolhidos, idAbencoada]
      : idsEscolhidos;
    const poderesExibidos = getPoderesConcedidosByIds(idsExibidos);
    const idsJaEscolhidos = new Set(idsEscolhidos);
    const opcoesDisponiveis = poderesDaDivindade.filter(
      (p) => !idsJaEscolhidos.has(p.id),
    );
    const todosPoderes = getPoderesConcedidos();
    const linhagemAbencoada = hasLinhagemAbencoada(sheet);

    function addPoderConcedido(id: string) {
      if (!id) return;
      const atuais = sheet.poderesDivindadeIds ?? [];
      if (atuais.includes(id)) return;
      onChange({
        ...sheet,
        poderesDivindadeIds: [...atuais, id],
      });
    }

    function removePoderConcedido(id: string) {
      const atuais = sheet.poderesDivindadeIds ?? [];
      onChange({
        ...sheet,
        poderesDivindadeIds: atuais.filter((x) => x !== id),
      });
    }

    function setPoderAbencoada(id: string) {
      onChange({
        ...sheet,
        poderConcedidoLinhagemAbencoadaId: id || undefined,
      });
    }

    return (
      <div className="space-y-4">
        {deus?.descricao_resumida && (
          <p className="text-sm text-ink">{deus.descricao_resumida}</p>
        )}

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase text-ink-muted">
            Poderes concedidos pela divindade
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value=""
              onChange={(e) => {
                const v = e.target.value;
                if (v) addPoderConcedido(v);
                e.target.value = "";
              }}
              className="rounded border border-border bg-paper-card px-2 py-1.5 text-sm shadow-sm focus:border-accent focus:outline-none"
            >
              <option value="">Adicionar poder concedido</option>
              {opcoesDisponiveis.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {linhagemAbencoada && (
          <div className="space-y-2 border-t border-border pt-3">
            <p className="text-[11px] font-semibold uppercase text-ink-muted">
              Poder concedido (linhagem abençada — qualquer divindade)
            </p>
            <select
              value={idAbencoada ?? ""}
              onChange={(e) => setPoderAbencoada(e.target.value)}
              className="rounded border border-border bg-paper-card px-2 py-1.5 text-sm shadow-sm focus:border-accent focus:outline-none"
            >
              <option value="">Nenhum</option>
              {todosPoderes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {poderesExibidos.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Nenhum poder concedido adicionado ainda.
          </p>
        ) : (
          <ul className="space-y-2">
            {poderesExibidos.map((poder) => {
              const ehAbencoada = poder.id === idAbencoada;
              return (
                <li
                  key={poder.id}
                  className="flex items-start justify-between gap-2 rounded border border-border bg-paper p-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {poder.nome}
                      {ehAbencoada && (
                        <span className="ml-1 text-[10px] font-normal text-ink-muted">
                          (linhagem abençada)
                        </span>
                      )}
                    </p>
                    {poder.descricao && (
                      <p className="mt-0.5 text-xs text-ink">
                        {poder.descricao}
                      </p>
                    )}
                  </div>
                  {ehAbencoada ? (
                    <button
                      type="button"
                      onClick={() => setPoderAbencoada("")}
                      className="rounded border border-red-300 bg-paper-card px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Remover
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removePoderConcedido(poder.id)}
                      className="rounded border border-red-300 bg-paper-card px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Remover
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  function renderPlaceholder(label: string) {
    return (
      <p className="text-sm text-ink-muted">
        A aba <span className="font-semibold">{label}</span> ainda não está
        ligada automaticamente aos dados. Por enquanto, use a aba
        &nbsp;&quot;Anotações&quot; para registrar esses poderes.
      </p>
    );
  }

  let content: React.ReactNode;

  if (activeTab === "raciais") {
    content = renderRacialPowers();
  } else if (activeTab === "origem") {
    content = renderOriginPowers();
  } else if (activeTab === "classes") {
    content = renderClassPowers();
  } else if (activeTab === "divindade") {
    content = renderDivindadePowers();
  } else {
    content = renderPlaceholder("Diversos");
  }

  return (
    <section className="space-y-4 rounded-md border border-border bg-paper-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-ink">
          Poderes e Habilidades
        </h2>
      </div>

      <div className="border-b border-border">
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
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-muted hover:text-ink")
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

