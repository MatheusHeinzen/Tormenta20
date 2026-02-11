'use client';

import { useRouter, useParams } from "next/navigation";
import { useSheetContext } from "@/context/SheetContext";
import { abilityModifier, type AbilityScoreName } from "@/lib/models/character";

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
      className="flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
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
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-zinc-600">
          Carregando ficha...
        </p>
      </main>
    );
  }

  const sheet = characters.find((character) => character.id === params.id);

  if (!sheet) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-zinc-600">
          Ficha não encontrada. Verifique se ela ainda existe na lista de
          fichas.
        </p>
      </main>
    );
  }

  const atributoDefesa: AbilityScoreName =
    sheet.config?.derived.atributoDefesa ?? "destreza";
  const defesaMod = abilityModifier(sheet.atributos[atributoDefesa]);

  function adjustPv(target: typeof sheet, delta: number) {
    if (!target) return;

    updateCharacter({
      ...target,
      combate: {
        ...target.combate,
        pvAtual: Math.max(
          0,
          Math.min(target.combate.pvMaximo, target.combate.pvAtual + delta),
        ),
      },
    });
  }

  function adjustPm(target: typeof sheet, delta: number) {
    if (!target) return;

    updateCharacter({
      ...target,
      combate: {
        ...target.combate,
        pmAtual: Math.max(
          0,
          Math.min(target.combate.pmMaximo, target.combate.pmAtual + delta),
        ),
      },
    });
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Sessão – {sheet.nome}
          </h1>
          <p className="text-xs text-zinc-600">
            Use os botões para ajustar PV e PM rapidamente durante a sessão.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/sheets/${sheet.id}/edit`)}
          className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Editar ficha
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">
            Pontos de Vida
          </h2>
          <p className="text-2xl font-semibold text-zinc-900">
            {sheet.combate.pvAtual}{" "}
            <span className="text-base font-normal text-zinc-500">
              / {sheet.combate.pvMaximo}
            </span>
          </p>
          <div className="flex gap-2">
            <StatButton label="-1 PV" onClick={() => adjustPv(sheet, -1)} />
            <StatButton label="-5 PV" onClick={() => adjustPv(sheet, -5)} />
            <StatButton label="+1 PV" onClick={() => adjustPv(sheet, 1)} />
            <StatButton label="+5 PV" onClick={() => adjustPv(sheet, 5)} />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">
            Pontos de Mana
          </h2>
          <p className="text-2xl font-semibold text-zinc-900">
            {sheet.combate.pmAtual}{" "}
            <span className="text-base font-normal text-zinc-500">
              / {sheet.combate.pmMaximo}
            </span>
          </p>
          <div className="flex gap-2">
            <StatButton label="-1 PM" onClick={() => adjustPm(sheet, -1)} />
            <StatButton label="-5 PM" onClick={() => adjustPm(sheet, -5)} />
            <StatButton label="+1 PM" onClick={() => adjustPm(sheet, 1)} />
            <StatButton label="+5 PM" onClick={() => adjustPm(sheet, 5)} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Resumo</h2>
          <p className="text-xs text-zinc-600">
            {sheet.raca} • {sheet.origem} • {sheet.classePrincipal} nível{" "}
            {sheet.nivel}
          </p>
          <p className="text-xs text-zinc-600">
            CA {sheet.combate.caTotal} (
            {atributoDefesa.toUpperCase()}{" "}
            {defesaMod >= 0 ? `+${defesaMod}` : defesaMod}) • Deslocamento{" "}
            {sheet.combate.deslocamento}m
          </p>
        </div>

        <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Inventário</h2>
          {sheet.inventario.itens.length === 0 ? (
            <p className="text-xs text-zinc-500">
              Nenhum item cadastrado. Edite a ficha para adicionar itens.
            </p>
          ) : (
            <ul className="space-y-1 text-xs text-zinc-700">
              {sheet.inventario.itens.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span>{item.nome}</span>
                  <span className="text-zinc-500">
                    {item.quantidade} × {item.slots} slots
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">
          Habilidades & anotações rápidas
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase text-zinc-600">
              Habilidades
            </h3>
            <p className="text-xs text-zinc-700 whitespace-pre-wrap">
              {sheet.habilidades.habilidadesClassePoderes ||
                sheet.habilidades.habilidadesRacaOrigem ||
                "Use a tela de edição para registrar habilidades importantes."}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase text-zinc-600">
              Anotações
            </h3>
            <p className="text-xs text-zinc-700 whitespace-pre-wrap">
              {sheet.notas.anotacoesGerais ||
                sheet.notas.historicoAliadosTesouros ||
                "Use a tela de edição para registrar anotações da sessão."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


