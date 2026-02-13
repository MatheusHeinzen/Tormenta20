import type { CharacterClass, CharacterSheet } from "@/lib/models/character";
import { applyClassProficiencies } from "@/lib/t20/class";
import {
  getClasses,
  getClassByNome,
  getLinhagemById,
  getLinhagens,
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
    <section className="space-y-5 rounded-md border border-border bg-paper-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-base font-semibold text-ink">Classes</h2>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90"
        >
          Adicionar classe
        </button>
      </div>

      {classes.length === 0 ? (
        <p className="text-sm text-ink-muted">
          Nenhuma classe adicionada. Use &quot;Adicionar classe&quot; para
          começar.
        </p>
      ) : (
        <div className="space-y-3">
          {classes.map((klass, index) => (
            <details
              key={klass.id}
              className="rounded-md border border-border bg-paper p-4"
              open={index === 0}
            >
              <summary className="flex items-center justify-between gap-2 cursor-pointer">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <select
                    value={klass.nome}
                    onChange={(event) =>
                      handleChange(index, { nome: event.target.value })
                    }
                    className="max-w-[180px] rounded border border-border bg-paper-card px-2 py-1 text-sm text-ink shadow-sm focus:border-accent focus:outline-none"
                  >
                    {allClassOptions.map((option) => (
                      <option key={option.id} value={option.nome}>
                        {option.nome}
                      </option>
                    ))}
                  </select>
                  {getClassByNome(klass.nome)?.id === "arcanista" && (
                    <>
                      <span className="text-xs font-semibold text-ink-muted">
                        Caminho
                      </span>
                      <select
                        value={klass.caminho ?? ""}
                        onChange={(e) =>
                          handleChange(index, {
                            caminho: e.target.value || undefined,
                            linhagem: e.target.value !== "feiticeiro" ? undefined : klass.linhagem,
                          })
                        }
                        className="max-w-[120px] rounded border border-border bg-paper-card px-2 py-1 text-sm text-ink shadow-sm focus:border-accent focus:outline-none"
                      >
                        <option value="">—</option>
                        <option value="bruxo">Bruxo</option>
                        <option value="feiticeiro">Feiticeiro</option>
                        <option value="mago">Mago</option>
                      </select>
                      {klass.caminho === "feiticeiro" && (
                        <>
                          <span className="text-xs font-semibold text-ink-muted">
                            Linhagem
                          </span>
                          <select
                            value={klass.linhagem ?? ""}
                            onChange={(e) =>
                              handleChange(index, {
                                linhagem: e.target.value || undefined,
                              })
                            }
                            className="max-w-[160px] rounded border border-border bg-paper-card px-2 py-1 text-sm text-ink shadow-sm focus:border-accent focus:outline-none"
                          >
                            <option value="">—</option>
                            {getLinhagens().map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.nome}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </>
                  )}
                  <span className="text-xs font-semibold text-ink-muted">
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
                    className="w-16 rounded border border-border bg-paper-card px-2 py-1 text-sm text-ink shadow-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    handleRemove(index);
                  }}
                  className="rounded border border-red-300 bg-paper-card px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  Remover
                </button>
              </summary>

              <div className="mt-3 space-y-3 text-xs text-ink-muted">
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
                  const isArcanista = data.id === "arcanista";
                  const caminho = klass.caminho;
                  const atributoMagia =
                    data.magia?.atributo_chave_por_caminho && caminho
                      ? data.magia.atributo_chave_por_caminho[caminho]
                      : data.magia?.atributo_chave ?? null;
                  const labelAtributo =
                    atributoMagia === "carisma"
                      ? "Carisma"
                      : atributoMagia === "inteligencia"
                        ? "Inteligência"
                        : atributoMagia === "sabedoria"
                          ? "Sabedoria"
                          : atributoMagia ?? "—";
                  const linhagem =
                    caminho === "feiticeiro" && klass.linhagem
                      ? getLinhagemById(klass.linhagem)
                      : null;

                  function descricaoArcanista() {
                    if (!caminho) {
                      return (
                        <p className="text-ink">
                          Conjurador arcano. Escolha o <strong>Caminho</strong> acima
                          (Bruxo, Feiticeiro ou Mago) para ver as regras que se
                          aplicam a você.
                        </p>
                      );
                    }
                    if (caminho === "bruxo") {
                      return (
                        <p className="text-ink">
                          <strong>Bruxo:</strong> conjura por um foco (varinha,
                          cajado, chapéu). Atributo: Inteligência. Aprende 1 magia
                          nova por nível. Sem o foco, teste de Misticismo (CD 20 +
                          custo em PM) ou a magia falha.
                        </p>
                      );
                    }
                    if (caminho === "feiticeiro") {
                      return (
                        <>
                          <p className="text-ink">
                            <strong>Feiticeiro:</strong> magia inata no sangue.
                            Atributo: Carisma. Aprende 1 magia nova a cada nível
                            ímpar (3º, 5º, 7º…). Não depende de grimório nem
                            foco.
                          </p>
                          {linhagem && (
                            <p className="text-ink">
                              <strong>Linhagem ({linhagem.nome}):</strong>{" "}
                              {linhagem.descricao_resumida}
                            </p>
                          )}
                        </>
                      );
                    }
                    if (caminho === "mago") {
                      return (
                        <p className="text-ink">
                          <strong>Mago:</strong> conjura por estudo e grimório.
                          Atributo: Inteligência. Começa com 4 magias; ao
                          desbloquear um novo círculo, aprende +1 magia daquele
                          círculo. Memoriza metade das magias conhecidas (marque
                          na aba Magias).
                        </p>
                      );
                    }
                    return data?.descricao_resumida ? (
                      <p className="text-ink">{data.descricao_resumida}</p>
                    ) : null;
                  }

                  return (
                    <>
                      {isArcanista ? descricaoArcanista() : data.descricao_resumida && (
                        <p className="text-ink">
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
                          º círculo. Atributo: {labelAtributo}. CD = 10 + círculo
                          + mod. Bônus de teste = mod + nível.
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

