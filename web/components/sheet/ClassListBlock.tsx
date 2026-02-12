import type { CharacterClass, CharacterSheet } from "@/lib/models/character";
import { applyClassProficiencies } from "@/lib/t20/class";
import {
  getClasses,
  getClassByNome,
  getPoderesClasse,
  getPoderesClasseByIds,
} from "@/lib/data/tormenta20";
import { skillRules } from "@/lib/data/tormenta20";

interface ClassListBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

function nomePericia(id: string): string {
  return skillRules.find((s) => s.id === id)?.nome ?? id;
}

export function ClassListBlock({ sheet, onChange }: ClassListBlockProps) {
  const classes = sheet.classes;

  function updateClasses(next: CharacterClass[]) {
    const nextSheet = applyClassProficiencies({
      ...sheet,
      classes: next,
    });
    onChange(nextSheet);
  }

  function handleChange(index: number, partial: Partial<CharacterClass>) {
    const next = classes.map((klass, idx) =>
      idx === index ? { ...klass, ...partial } : klass,
    );
    updateClasses(next);
  }

  function handleAdd() {
    const baseName = getClasses()[0]?.nome ?? "Nova classe";
    const nova: CharacterClass = {
      id: crypto.randomUUID(),
      nome: baseName,
      nivel: 1,
    };
    updateClasses([...classes, nova]);
  }

  function handleRemove(index: number) {
    const next = classes.filter((_, idx) => idx !== index);
    updateClasses(next);
  }

  const allClassOptions = getClasses();

  return (
    <section className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900">Classes</h2>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
        >
          Adicionar classe
        </button>
      </div>

      {classes.length === 0 ? (
        <p className="text-sm text-zinc-600">
          Nenhuma classe adicionada. Use &quot;Adicionar classe&quot; para
          começar.
        </p>
      ) : (
        <div className="space-y-3">
          {classes.map((klass, index) => (
            <details
              key={klass.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
              open={index === 0}
            >
              <summary className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex flex-1 items-center gap-2">
                  <select
                    value={klass.nome}
                    onChange={(event) =>
                      handleChange(index, { nome: event.target.value })
                    }
                    className="max-w-[180px] rounded border border-zinc-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                  >
                    {allClassOptions.map((option) => (
                      <option key={option.id} value={option.nome}>
                        {option.nome}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs font-semibold text-zinc-500">
                    Nível
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={klass.nivel}
                    onChange={(event) =>
                      handleChange(index, {
                        nivel: Number(event.target.value) || 1,
                      })
                    }
                    className="w-16 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    handleRemove(index);
                  }}
                  className="rounded border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  Remover
                </button>
              </summary>

              <div className="mt-3 space-y-3 text-xs text-zinc-600">
                {(() => {
                  const data = getClassByNome(klass.nome);
                  if (!data) return null;
                  const poderesIds =
                    data.habilidades_por_nivel?.flatMap((h) => h.poderes) ?? [];
                  const poderes = getPoderesClasseByIds(poderesIds);
                  const base = data.pericias_base ?? [];
                  const treinaveis = data.pericias_treinaveis ?? [];
                  const treinadas =
                    typeof data.pericias_treinadas === "number"
                      ? String(data.pericias_treinadas)
                      : data.pericias_treinadas ?? "—";
                  const prof =
                    data.proficiencias &&
                    [
                      data.proficiencias.armas?.length
                        ? `Armas: ${data.proficiencias.armas.join(", ")}`
                        : "",
                      data.proficiencias.armaduras?.length
                        ? `Armaduras: ${data.proficiencias.armaduras.join(", ")}`
                        : "",
                      data.proficiencias.escudos?.length
                        ? `Escudos: ${data.proficiencias.escudos.join(", ")}`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" • ");
                  return (
                    <>
                      {data.descricao_resumida && (
                        <p className="text-zinc-700">
                          {data.descricao_resumida}
                        </p>
                      )}
                      {data.vida_nivel_1 != null && (
                        <p>
                          <strong>PV:</strong> {data.vida_nivel_1} + Const (1º
                          nível); {data.vida_por_nivel} + Const/nível.{" "}
                          <strong>PM:</strong> {data.mana_por_nivel}/nível.
                        </p>
                      )}
                      {base.length > 0 && (
                        <p>
                          <strong>Perícias base:</strong>{" "}
                          {base.map(nomePericia).join(", ")}.
                        </p>
                      )}
                      {treinaveis.length > 0 && (
                        <p>
                          <strong>Perícias treináveis:</strong> escolha até{" "}
                          {treinadas} entre:{" "}
                          {treinaveis.map(nomePericia).join(", ")}.
                        </p>
                      )}
                      {prof && (
                        <p>
                          <strong>Proficiências:</strong> {prof}.
                        </p>
                      )}
                      {data.magia?.conjurador && (
                        <p>
                          <strong>Magia:</strong> até {data.magia.circulo_maximo}
                          º círculo. Atributo:{" "}
                          {data.magia.atributo_chave ??
                            (data.magia.atributo_chave_por_caminho
                              ? "depende do caminho (Int/Car)"
                              : "—")}
                          . CD = 10 + círculo + mod. Bônus de teste = mod +
                          nível.
                        </p>
                      )}
                      {poderes.length > 0 && (
                        <div>
                          <strong>Poderes de classe:</strong>
                          <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1">
                            {poderes.map((p) => (
                              <li key={p.id}>
                                {p.nome}
                                {p.descricao_resumida
                                  ? ` — ${p.descricao_resumida}`
                                  : ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

