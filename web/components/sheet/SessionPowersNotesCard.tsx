"use client";

import { useState } from "react";
import type { CharacterSheet } from "@/lib/models/character";

type TabId = "raca-origem" | "classe-poderes" | "anotacoes";

const TABS: { id: TabId; label: string }[] = [
  { id: "raca-origem", label: "Raça / Origem" },
  { id: "classe-poderes", label: "Classe / Poderes" },
  { id: "anotacoes", label: "Anotações" },
];

interface SessionPowersNotesCardProps {
  sheet: CharacterSheet;
}

export function SessionPowersNotesCard({
  sheet,
}: SessionPowersNotesCardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("raca-origem");
  const racaOrigem = sheet.habilidades?.habilidadesRacaOrigem ?? "";
  const classePoderes = sheet.habilidades?.habilidadesClassePoderes ?? "";
  const anotacoesGerais = sheet.notas?.anotacoesGerais ?? "";
  const historico = sheet.notas?.historicoAliadosTesouros ?? "";

  const conteudoRacaOrigem = racaOrigem.trim() || "Nenhuma anotação de raça ou origem. Edite a ficha para preencher.";
  const conteudoClassePoderes = classePoderes.trim() || "Nenhuma anotação de classe ou poderes. Edite a ficha para preencher.";
  const conteudoAnotacoes =
    [anotacoesGerais.trim(), historico.trim()].filter(Boolean).join("\n\n") ||
    "Nenhuma anotação. Edite a ficha para registrar anotações da sessão.";

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
      <div className="min-h-[120px] p-4">
        {activeTab === "raca-origem" && (
          <p className="whitespace-pre-wrap text-xs text-ink">
            {conteudoRacaOrigem}
          </p>
        )}
        {activeTab === "classe-poderes" && (
          <p className="whitespace-pre-wrap text-xs text-ink">
            {conteudoClassePoderes}
          </p>
        )}
        {activeTab === "anotacoes" && (
          <p className="whitespace-pre-wrap text-xs text-ink">
            {conteudoAnotacoes}
          </p>
        )}
      </div>
    </section>
  );
}
