"use client";

import { useState } from "react";
import type {
  AbilityScoreName,
  CharacterSheet,
  CharacterSkill,
} from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";
import {
  getClassByNome,
  getOrigemByNome,
  skillRules,
  type SkillRule,
} from "@/lib/data/tormenta20";

const SKILL_TRAINED_BONUS = 2;

type TabId = "ataques" | "magias" | "pericias";

const TABS: { id: TabId; label: string }[] = [
  { id: "ataques", label: "Ataques" },
  { id: "magias", label: "Magias" },
  { id: "pericias", label: "Perícias" },
];

function getPericiasFromClasses(sheet: CharacterSheet): {
  base: string[];
  treinaveis: string[];
} {
  const classes = sheet.classes ?? [];
  const baseSet = new Set<string>();
  const treinaveisSet = new Set<string>();
  for (const klass of classes) {
    const data = getClassByNome(klass.nome);
    if (!data) continue;
    (data.pericias_base ?? []).forEach((id: string) => baseSet.add(id));
    (data.pericias_treinaveis ?? []).forEach((id: string) => treinaveisSet.add(id));
  }
  const origem = getOrigemByNome(sheet.origem);
  (origem?.pericias ?? []).forEach((id: string) => baseSet.add(id));
  return { base: [...baseSet], treinaveis: [...treinaveisSet] };
}

function getSkillTotal(
  sheet: CharacterSheet,
  skillId: string,
  byId: Map<string, CharacterSkill>,
  baseIds: string[],
  effectiveTreinada?: boolean,
): number {
  const rule = skillRules.find((s) => s.id === skillId);
  if (!rule) return 0;
  const config =
    byId.get(skillId) ??
    ({
      id: skillId,
      atributoUsado: rule.atributoPadrao,
      bonusOutros: 0,
      treinada: false,
    } as CharacterSkill);
  const modAtributo = abilityModifier(sheet.atributos[config.atributoUsado]);
  const treinada = effectiveTreinada ?? config.treinada ?? baseIds.includes(skillId);
  const bonusTreinado = treinada ? SKILL_TRAINED_BONUS : 0;
  return modAtributo + bonusTreinado + config.bonusOutros;
}

interface SessionCombatSkillsSpellsCardProps {
  sheet: CharacterSheet;
}

export function SessionCombatSkillsSpellsCard({
  sheet,
}: SessionCombatSkillsSpellsCardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("ataques");
  const ataques = sheet.ataques ?? [];
  const magias = sheet.magias ?? [];
  const cdMagia = sheet.magia?.cd ?? 10;
  const { base: baseIds } = getPericiasFromClasses(sheet);
  const byId = new Map<string, CharacterSkill>();
  for (const s of sheet.pericias) byId.set(s.id, s);

  return (
    <section className="rounded-md border border-border bg-paper-card shadow-sm">
      <div className="flex border-b border-border">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === id
                ? "border-b-2 border-accent bg-paper-card text-ink"
                : "text-ink-muted hover:bg-paper hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="min-h-[140px] p-4">
        {activeTab === "ataques" && (
          <>
            {ataques.length === 0 ? (
              <p className="text-xs text-ink-muted">
                Nenhum ataque cadastrado. Edite a ficha para adicionar.
              </p>
            ) : (
              <ul className="space-y-2">
                {ataques.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded border border-border bg-paper px-3 py-2 text-xs"
                  >
                    <span className="font-semibold text-ink">
                      {a.nome || "—"}
                    </span>
                    <span className="text-ink-muted">
                      {a.teste} {a.bonusAtaque >= 0 ? `+${a.bonusAtaque}` : a.bonusAtaque}
                    </span>
                    <span className="text-ink-muted">dano {a.dano}</span>
                    <span className="text-ink-muted">
                      crítico {a.critico} · {a.tipo} · {a.alcance}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {activeTab === "magias" && (
          <>
            <p className="mb-2 text-[11px] font-semibold text-ink-muted">
              CD das magias: {cdMagia}
            </p>
            {magias.length === 0 ? (
              <p className="text-xs text-ink-muted">
                Nenhuma magia cadastrada. Edite a ficha para adicionar.
              </p>
            ) : (
              <ul className="space-y-2">
                {magias.map((m) => (
                  <li key={m.id}>
                    <details className="group rounded-md border border-border bg-paper">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs [&::-webkit-details-marker]:hidden">
                        <span className="font-semibold text-ink">
                          {m.nome || "—"}
                        </span>
                        <span className="text-ink-muted">
                          {m.circulo ?? 0}º círculo
                          {m.alcance ? ` · ${m.alcance}` : ""}
                        </span>
                        <span className="text-ink-muted transition group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <div className="border-t border-border px-3 py-2 text-xs text-ink">
                        <dl className="grid gap-1.5 sm:grid-cols-2">
                          {m.escola && (
                            <div>
                              <dt className="font-semibold text-ink-muted">Escola</dt>
                              <dd>{m.escola}</dd>
                            </div>
                          )}
                          {m.execucao && (
                            <div>
                              <dt className="font-semibold text-ink-muted">Execução</dt>
                              <dd>{m.execucao}</dd>
                            </div>
                          )}
                          {m.alcance && (
                            <div>
                              <dt className="font-semibold text-ink-muted">Alcance</dt>
                              <dd>{m.alcance}</dd>
                            </div>
                          )}
                          {m.area && (
                            <div>
                              <dt className="font-semibold text-ink-muted">Área</dt>
                              <dd>{m.area}</dd>
                            </div>
                          )}
                          {m.duracao && (
                            <div>
                              <dt className="font-semibold text-ink-muted">Duração</dt>
                              <dd>{m.duracao}</dd>
                            </div>
                          )}
                          {m.resistencia && (
                            <div>
                              <dt className="font-semibold text-ink-muted">Resistência</dt>
                              <dd>{m.resistencia}</dd>
                            </div>
                          )}
                          {m.cd != null && (
                            <div>
                              <dt className="font-semibold text-ink-muted">CD</dt>
                              <dd>{m.cd}</dd>
                            </div>
                          )}
                        </dl>
                        {m.efeito && (
                          <div className="mt-2">
                            <dt className="font-semibold text-ink-muted">Efeito</dt>
                            <p className="mt-0.5 whitespace-pre-wrap">{m.efeito}</p>
                          </div>
                        )}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {activeTab === "pericias" && (
          <div className="grid gap-2 sm:grid-cols-2">
            {skillRules.map((rule: SkillRule) => {
              const effectiveTreinada =
                (byId.get(rule.id)?.treinada ?? false) || baseIds.includes(rule.id);
              const total = getSkillTotal(
                sheet,
                rule.id,
                byId,
                baseIds,
                effectiveTreinada,
              );
              const label = total >= 0 ? `+${total}` : String(total);
              return (
                <div
                  key={rule.id}
                  className="flex justify-between gap-2 rounded border border-border bg-paper px-2 py-1 text-xs"
                >
                  <span className="font-semibold text-ink">{label}</span>
                  <span className="text-ink">{rule.nome}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
