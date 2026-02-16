import type { CharacterSheet, Engenhoca } from "@/lib/models/character";
import { getClassByNome } from "@/lib/data/tormenta20";
import { getConjuradorMagiaInfo } from "@/lib/t20/class";

interface SpellsBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

export function SpellsBlock({ sheet, onChange }: SpellsBlockProps) {
  const magias = sheet.magias;
  const conjurador = getConjuradorMagiaInfo(sheet);
  const engenhocas = sheet.engenhocas ?? [];
  const isInventor = (sheet.classes ?? []).some(
    (k) => getClassByNome(k.nome)?.id === "inventor",
  );

  function handleChange(index: number, partial: Partial<CharacterSheet["magias"][number]>) {
    const next = magias.map((spell, idx) =>
      idx === index ? { ...spell, ...partial } : spell,
    );
    onChange({
      ...sheet,
      magias: next,
    });
  }

  function handleAdd() {
    const nova = {
      id: crypto.randomUUID(),
      nome: "",
      circulo: 1,
      escola: "",
      alcance: "",
      area: "",
      duracao: "",
      resistencia: "",
      efeito: "",
    } as CharacterSheet["magias"][number];

    onChange({
      ...sheet,
      magias: [...magias, nova],
    });
  }

  function handleRemove(index: number) {
    const next = magias.filter((_, idx) => idx !== index);
    onChange({
      ...sheet,
      magias: next,
    });
  }

  function handleEngenhocaChange(
    index: number,
    partial: Partial<Engenhoca>,
  ) {
    const next = engenhocas.map((e, i) =>
      i === index ? { ...e, ...partial } : e,
    );
    onChange({ ...sheet, engenhocas: next });
  }

  function handleAddEngenhoca() {
    const nova: Engenhoca = {
      id: crypto.randomUUID(),
      nome: "",
    };
    onChange({ ...sheet, engenhocas: [...engenhocas, nova] });
  }

  function handleRemoveEngenhoca(index: number) {
    const next = engenhocas.filter((_, i) => i !== index);
    onChange({ ...sheet, engenhocas: next });
  }

  return (
    <section className="space-y-5 rounded-md border border-border bg-paper-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-base font-semibold text-ink">Magias</h2>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90"
        >
          Adicionar magia
        </button>
      </div>

      {conjurador && (
        <div className="space-y-4 rounded-md border border-border bg-paper p-4 text-sm">
          <p className="text-[11px] font-semibold uppercase text-ink-muted">
            Conjuração (classe)
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[11px] font-semibold text-ink-muted">
                CD das magias
              </p>
              <p className="mt-0.5 text-[11px] text-ink-muted">
                10 + metade do nível (arred. cima) + mod.{conjurador.atributoLabel}
              </p>
              <input
                type="number"
                value={sheet.magia?.cd ?? conjurador.cdBase}
                onChange={(e) =>
                  onChange({
                    ...sheet,
                    magia: {
                      ...sheet.magia,
                      cd: Number(e.target.value) || 0,
                    },
                  })
                }
                className="mt-1 w-full rounded border border-border bg-paper-card px-2 py-1.5 font-semibold text-ink shadow-sm focus:border-accent focus:outline-none"
              />
              <p className="mt-0.5 text-[10px] text-ink-muted">
                Sugerido: {conjurador.cdBase}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-muted">
                Bônus de teste de magia
              </p>
              <p className="mt-1 font-semibold text-ink">
                {conjurador.bonusTeste >= 0 ? `+${conjurador.bonusTeste}` : conjurador.bonusTeste}{" "}
                <span className="text-xs font-normal text-ink-muted">(mod. + nível)</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-muted">
                Número de magias conhecidas
              </p>
              <p className="mt-1 font-semibold text-ink">
                {conjurador.magiasConhecidas}{" "}
                <span className="text-xs font-normal text-ink-muted">(nível {conjurador.nivelTotal})</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-muted">
                Círculo máximo
              </p>
              <p className="mt-1 font-semibold text-ink">
                {conjurador.circuloMax}º
              </p>
            </div>
            {conjurador.memorizaMetade && (
              <div>
                <p className="text-[11px] font-semibold text-ink-muted">
                  Magias memorizadas
                </p>
                <p className="mt-1 font-semibold text-ink">
                  {magias.filter((m) => m.memorizada).length} / {conjurador.maxMemorizadas}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {magias.length === 0 ? (
        <p className="text-sm text-ink-muted">
          Nenhuma magia cadastrada. Use &quot;Adicionar magia&quot; para criar
          entradas por círculo.
        </p>
      ) : (
        <div className="space-y-3">
          {magias.map((spell, index) => (
            <details
              key={spell.id}
              className="rounded-md border border-border bg-paper p-4"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                  {conjurador?.memorizaMetade && (
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        id={`mem-${spell.id}`}
                        checked={!!spell.memorizada}
                        disabled={
                          !spell.memorizada &&
                          magias.filter((m) => m.memorizada).length >= (conjurador?.maxMemorizadas ?? 0)
                        }
                        onChange={(e) =>
                          handleChange(index, { memorizada: e.target.checked })
                        }
                        className="rounded border-border"
                      />
                      <label htmlFor={`mem-${spell.id}`} className="cursor-pointer text-[11px]">
                        Memorizada
                      </label>
                    </div>
                  )}
                  <span className="font-semibold uppercase">Círculo</span>
                  <span className="text-sm font-semibold text-ink">
                    {spell.circulo ?? 0}
                  </span>
                  <span className="font-semibold uppercase">Nome</span>
                  <span className="text-sm font-semibold text-ink">
                    {spell.nome || "Sem nome"}
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted">
                  Clique para expandir
                </span>
              </summary>

              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {conjurador?.memorizaMetade && (
                      <label className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-ink-muted">
                        <input
                          type="checkbox"
                          checked={!!spell.memorizada}
                          disabled={
                            !spell.memorizada &&
                            magias.filter((m) => m.memorizada).length >= (conjurador?.maxMemorizadas ?? 0)
                          }
                          onChange={(e) =>
                            handleChange(index, { memorizada: e.target.checked })
                          }
                          className="rounded border-border"
                        />
                        Memorizada
                      </label>
                    )}
                    <label className="flex items-center gap-1 text-xs font-semibold text-ink-muted">
                      Círculo
                      <input
                        type="number"
                        min={0}
                        max={5}
                        value={spell.circulo ?? 0}
                        onChange={(event) =>
                          handleChange(index, {
                            circulo: Number(event.target.value) || 0,
                          })
                        }
                        className="w-14 rounded border border-border px-1 py-0.5 text-[11px] shadow-sm focus:border-accent focus:outline-none"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Nome da magia"
                      value={spell.nome}
                      onChange={(event) =>
                        handleChange(index, { nome: event.target.value })
                      }
                      className="min-w-[160px] flex-1 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="rounded border border-red-200 bg-paper-card px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Remover
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-ink-muted">
                      Escola
                    </label>
                    <input
                      type="text"
                      value={spell.escola ?? ""}
                      onChange={(event) =>
                        handleChange(index, { escola: event.target.value })
                      }
                      className="w-full rounded border border-border px-2 py-1 text-xs shadow-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-ink-muted">
                      Alcance
                    </label>
                    <input
                      type="text"
                      value={spell.alcance ?? ""}
                      onChange={(event) =>
                        handleChange(index, { alcance: event.target.value })
                      }
                      className="w-full rounded border border-border px-2 py-1 text-xs shadow-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-ink-muted">
                      Área
                    </label>
                    <input
                      type="text"
                      value={spell.area ?? ""}
                      onChange={(event) =>
                        handleChange(index, { area: event.target.value })
                      }
                      className="w-full rounded border border-border px-2 py-1 text-xs shadow-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-ink-muted">
                      Duração
                    </label>
                    <input
                      type="text"
                      value={spell.duracao ?? ""}
                      onChange={(event) =>
                        handleChange(index, { duracao: event.target.value })
                      }
                      className="w-full rounded border border-border px-2 py-1 text-xs shadow-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-ink-muted">
                      Resistência
                    </label>
                    <input
                      type="text"
                      value={spell.resistencia ?? ""}
                      onChange={(event) =>
                        handleChange(index, {
                          resistencia: event.target.value,
                        })
                      }
                      className="w-full rounded border border-border px-2 py-1 text-xs shadow-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-ink-muted">
                      Descrição / Efeito
                    </label>
                    <textarea
                      rows={2}
                      value={spell.efeito ?? ""}
                      onChange={(event) =>
                        handleChange(index, { efeito: event.target.value })
                      }
                      className="w-full rounded border border-border px-2 py-1 text-xs shadow-sm focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}

      {isInventor && (
        <details className="rounded-md border border-border bg-paper p-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
            Engenhocas (Inventor)
            {engenhocas.length > 0 && (
              <span className="ml-2 text-xs font-normal text-ink-muted">
                ({engenhocas.length}) — Clique para expandir
              </span>
            )}
            {engenhocas.length === 0 && (
              <span className="ml-2 text-xs font-normal text-ink-muted">
                Clique para expandir
              </span>
            )}
          </summary>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase text-ink-muted">
                Lista de engenhocas
              </h3>
              <button
                type="button"
                onClick={handleAddEngenhoca}
                className="rounded bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90"
              >
                Adicionar engenhoca
              </button>
            </div>
            {engenhocas.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Nenhuma engenhoca cadastrada. Use &quot;Adicionar
                engenhoca&quot; para começar.
              </p>
            ) : (
              <div className="space-y-3">
                {engenhocas.map((eng, index) => (
                  <details
                    key={eng.id}
                    className="rounded-md border border-border bg-paper-card p-3"
                  >
                    <summary className="cursor-pointer list-none text-xs font-semibold text-ink">
                      {eng.nome || "Sem nome"}
                    </summary>
                    <div className="mt-3 space-y-3 text-xs">
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="space-y-1">
                          <label className="block font-semibold text-ink-muted">
                            Nome
                          </label>
                          <input
                            type="text"
                            value={eng.nome}
                            onChange={(e) =>
                              handleEngenhocaChange(index, {
                                nome: e.target.value,
                              })
                            }
                            placeholder="Nome da engenhoca"
                            className="w-full rounded border border-border px-2 py-1.5 shadow-sm focus:border-accent focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-semibold text-ink-muted">
                            Magia / efeito simulado
                          </label>
                          <input
                            type="text"
                            value={eng.magiaOuEfeito ?? ""}
                            onChange={(e) =>
                              handleEngenhocaChange(index, {
                                magiaOuEfeito: e.target.value || undefined,
                              })
                            }
                            placeholder="Ex.: Bola de Fogo (2º círculo)"
                            className="w-full rounded border border-border px-2 py-1.5 shadow-sm focus:border-accent focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="space-y-1">
                          <label className="block font-semibold text-ink-muted">
                            CD (ativação)
                          </label>
                          <input
                            type="number"
                            value={eng.cd ?? ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              handleEngenhocaChange(index, {
                                cd: v === "" ? undefined : Number(v),
                              });
                            }}
                            placeholder="Ex.: 23"
                            className="w-full rounded border border-border px-2 py-1.5 shadow-sm focus:border-accent focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-semibold text-ink-muted">
                            Custo em PM
                          </label>
                          <input
                            type="text"
                            value={eng.custoPm ?? ""}
                            onChange={(e) =>
                              handleEngenhocaChange(index, {
                                custoPm: e.target.value || undefined,
                              })
                            }
                            placeholder="Ex.: 1 PM + CD da magia"
                            className="w-full rounded border border-border px-2 py-1.5 shadow-sm focus:border-accent focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block font-semibold text-ink-muted">
                          Observações
                        </label>
                        <textarea
                          rows={2}
                          value={eng.observacoes ?? ""}
                          onChange={(e) =>
                            handleEngenhocaChange(index, {
                              observacoes: e.target.value || undefined,
                            })
                          }
                          placeholder="Detalhes extras"
                          className="w-full rounded border border-border px-2 py-1.5 shadow-sm focus:border-accent focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEngenhoca(index)}
                        className="rounded border border-red-200 bg-paper px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Remover
                      </button>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </details>
      )}
    </section>
  );
}

