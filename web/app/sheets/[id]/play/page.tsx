'use client';

import { useRouter, useParams } from "next/navigation";
import { useSheetContext } from "@/context/SheetContext";
import { abilityModifier, type AbilityScoreName } from "@/lib/models/character";
import { getRaceDataByName, getTipoCriaturaLabel } from "@/lib/t20/race";
import { SessionCombatSkillsSpellsCard } from "@/components/sheet/SessionCombatSkillsSpellsCard";
import { SessionPowersNotesCard } from "@/components/sheet/SessionPowersNotesCard";
import { AdSidebar } from "@/components/ads/AdSidebar";

function StatButton({
  label,
  onClick,
}: {
  label: string;
  onClick(): void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[44px] flex-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
    >
      {label}
    </button>
  );
}

export default function PlaySheetPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { characters, updateCharacter, loading } = useSheetContext();

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-ink-muted">
          Carregando ficha...
        </p>
      </main>
    );
  }

  const sheet = characters.find((character) => character.id === params.id);

  if (!sheet) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-ink-muted">
          Ficha não encontrada. Verifique se ela ainda existe na lista de
          fichas.
        </p>
      </main>
    );
  }

  const atributoDefesa: AbilityScoreName =
    sheet.config?.derived.atributoDefesa ?? "destreza";
  const defesaMod = abilityModifier(sheet.atributos[atributoDefesa]);

  const classesResumo =
    sheet.classes && sheet.classes.length > 0
      ? sheet.classes.map((klass) => `${klass.nome} ${klass.nivel}`).join(" / ")
      : sheet.classePrincipal
        ? `${sheet.classePrincipal} ${sheet.nivel}`
        : "Sem classe";

  function adjustPv(target: typeof sheet, delta: number) {
    if (!target) return;
    const next = target.combate.pvAtual + delta;
    updateCharacter({
      ...target,
      combate: {
        ...target.combate,
        pvAtual: Math.max(0, next),
      },
    });
  }

  function adjustPm(target: typeof sheet, delta: number) {
    if (!target) return;
    const next = target.combate.pmAtual + delta;
    updateCharacter({
      ...target,
      combate: {
        ...target.combate,
        pmAtual: Math.max(0, next),
      },
    });
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-ink">
              Sessão – {sheet.nome}
            </h1>
            <p className="text-xs text-ink-muted">
              Use os botões para ajustar PV e PM rapidamente durante a sessão.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex min-h-[44px] items-center justify-center rounded border border-border bg-paper-card px-4 text-xs font-medium text-ink shadow-sm hover:bg-paper"
            >
              Voltar ao menu
            </button>
            <button
              type="button"
              onClick={() => router.push(`/sheets/${sheet.id}/edit`)}
              className="flex min-h-[44px] items-center justify-center rounded border border-border bg-paper-card px-4 text-xs font-medium text-ink shadow-sm hover:bg-paper"
            >
              Editar ficha
            </button>
          </div>
        </header>

        {/* Layout com sidebar em telas grandes */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          {/* Conteúdo principal */}
          <div className="min-w-0 space-y-6">
            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-md border border-border bg-paper-card p-4 shadow-sm">
                <h2 className="font-serif text-sm font-semibold text-ink">
                  Pontos de Vida
                </h2>
                <p className="text-2xl font-semibold text-ink">
                  {sheet.combate.pvAtual}{" "}
                  <span className="text-base font-normal text-ink-muted">
                    / {sheet.combate.pvMaximo}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <StatButton label="-1 PV" onClick={() => adjustPv(sheet, -1)} />
                  <StatButton label="-5 PV" onClick={() => adjustPv(sheet, -5)} />
                  <StatButton label="+1 PV" onClick={() => adjustPv(sheet, 1)} />
                  <StatButton label="+5 PV" onClick={() => adjustPv(sheet, 5)} />
                </div>
              </div>

              <div className="space-y-3 rounded-md border border-border bg-paper-card p-4 shadow-sm">
                <h2 className="font-serif text-sm font-semibold text-ink">
                  Pontos de Mana
                </h2>
                <p className="text-2xl font-semibold text-ink">
                  {sheet.combate.pmAtual}{" "}
                  <span className="text-base font-normal text-ink-muted">
                    / {sheet.combate.pmMaximo}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <StatButton label="-1 PM" onClick={() => adjustPm(sheet, -1)} />
                  <StatButton label="-5 PM" onClick={() => adjustPm(sheet, -5)} />
                  <StatButton label="+1 PM" onClick={() => adjustPm(sheet, 1)} />
                  <StatButton label="+5 PM" onClick={() => adjustPm(sheet, 5)} />
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-md border border-border bg-paper-card p-4 shadow-sm">
                <h2 className="font-serif text-sm font-semibold text-ink">Resumo</h2>
                <p className="text-xs text-ink-muted">
                  {sheet.raca} • {sheet.origem} • Tipo: {getTipoCriaturaLabel(getRaceDataByName(sheet.raca)?.tipo_criatura)} • {classesResumo}
                </p>
                <p className="text-xs text-ink-muted">
                  CA {sheet.combate.caTotal} (
                  {atributoDefesa.toUpperCase()}{" "}
                  {defesaMod >= 0 ? `+${defesaMod}` : defesaMod}) • Deslocamento{" "}
                  {sheet.combate.deslocamento}m
                </p>
              </div>

              <div className="space-y-2 rounded-md border border-border bg-paper-card p-4 shadow-sm">
                <h2 className="font-serif text-sm font-semibold text-ink">Inventário</h2>
                <p className="text-xs font-semibold text-ink-muted">
                  Dinheiro: {sheet.inventario.dinheiro ?? 0} T$
                </p>
                {sheet.inventario.itens.length === 0 ? (
                  <p className="text-xs text-ink-muted">
                    Nenhum item cadastrado. Edite a ficha para adicionar itens.
                  </p>
                ) : (
                  <ul className="space-y-1 text-xs text-ink">
                    {sheet.inventario.itens.map((item) => (
                      <li key={item.id} className="flex justify-between gap-2">
                        <span>{item.nome}</span>
                        <span className="text-ink-muted">
                          {item.quantidade} × {item.slots} slots
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-sm font-semibold text-ink">
                Ataques, magias e perícias
              </h2>
              <SessionCombatSkillsSpellsCard sheet={sheet} />
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-sm font-semibold text-ink">
                Poderes e anotações
              </h2>
              <SessionPowersNotesCard sheet={sheet} />
            </section>
          </div>

          {/* Sidebar com anúncios (apenas em telas grandes) */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 space-y-6">
              <AdSidebar adUnitId={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_AD_UNIT_ID} />
              {/* Segundo anúncio sidebar (opcional) */}
              <AdSidebar 
                adUnitId={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_AD_UNIT_ID_2}
                className="mt-8"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}


