import type { CharacterSheet } from "@/lib/models/character";
import { getConjuradorMagiaInfo } from "@/lib/t20/class";

interface SpellsBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

export function SpellsBlock({ sheet, onChange }: SpellsBlockProps) {
  const magias = sheet.magias;
  const conjurador = getConjuradorMagiaInfo(sheet);

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

  return (
    <section className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900">Magias</h2>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
        >
          Adicionar magia
        </button>
      </div>

      {conjurador && (
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
          <p className="text-[11px] font-semibold uppercase text-zinc-500">
            Conjuração (classe)
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[11px] font-semibold text-zinc-500">
                CD das magias
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">
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
                className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1.5 font-semibold text-zinc-900 shadow-sm focus:border-zinc-600 focus:outline-none"
              />
              <p className="mt-0.5 text-[10px] text-zinc-500">
                Sugerido: {conjurador.cdBase}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500">
                Bônus de teste de magia
              </p>
              <p className="mt-1 font-semibold text-zinc-900">
                {conjurador.bonusTeste >= 0 ? `+${conjurador.bonusTeste}` : conjurador.bonusTeste}{" "}
                <span className="text-xs font-normal text-zinc-500">(mod. + nível)</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500">
                Número de magias conhecidas
              </p>
              <p className="mt-1 font-semibold text-zinc-900">
                {conjurador.magiasConhecidas}{" "}
                <span className="text-xs font-normal text-zinc-500">(nível {conjurador.nivelTotal})</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-500">
                Círculo máximo
              </p>
              <p className="mt-1 font-semibold text-zinc-900">
                {conjurador.circuloMax}º
              </p>
            </div>
            {conjurador.memorizaMetade && (
              <div>
                <p className="text-[11px] font-semibold text-zinc-500">
                  Magias memorizadas
                </p>
                <p className="mt-1 font-semibold text-zinc-900">
                  {magias.filter((m) => m.memorizada).length} / {conjurador.maxMemorizadas}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {magias.length === 0 ? (
        <p className="text-sm text-zinc-600">
          Nenhuma magia cadastrada. Use &quot;Adicionar magia&quot; para criar
          entradas por círculo.
        </p>
      ) : (
        <div className="space-y-3">
          {magias.map((spell, index) => (
            <details
              key={spell.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
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
                        className="rounded border-zinc-300"
                      />
                      <label htmlFor={`mem-${spell.id}`} className="cursor-pointer text-[11px]">
                        Memorizada
                      </label>
                    </div>
                  )}
                  <span className="font-semibold uppercase">Círculo</span>
                  <span className="text-sm font-semibold text-zinc-900">
                    {spell.circulo ?? 0}
                  </span>
                  <span className="font-semibold uppercase">Nome</span>
                  <span className="text-sm font-semibold text-zinc-900">
                    {spell.nome || "Sem nome"}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500">
                  Clique para expandir
                </span>
              </summary>

              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {conjurador?.memorizaMetade && (
                      <label className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-zinc-600">
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
                          className="rounded border-zinc-300"
                        />
                        Memorizada
                      </label>
                    )}
                    <label className="flex items-center gap-1 text-xs font-semibold text-zinc-600">
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
                        className="w-14 rounded border border-zinc-300 px-1 py-0.5 text-[11px] shadow-sm focus:border-zinc-600 focus:outline-none"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Nome da magia"
                      value={spell.nome}
                      onChange={(event) =>
                        handleChange(index, { nome: event.target.value })
                      }
                      className="min-w-[160px] flex-1 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="rounded border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Remover
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-600">
                      Escola
                    </label>
                    <input
                      type="text"
                      value={spell.escola ?? ""}
                      onChange={(event) =>
                        handleChange(index, { escola: event.target.value })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1 text-xs shadow-sm focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-600">
                      Alcance
                    </label>
                    <input
                      type="text"
                      value={spell.alcance ?? ""}
                      onChange={(event) =>
                        handleChange(index, { alcance: event.target.value })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1 text-xs shadow-sm focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-600">
                      Área
                    </label>
                    <input
                      type="text"
                      value={spell.area ?? ""}
                      onChange={(event) =>
                        handleChange(index, { area: event.target.value })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1 text-xs shadow-sm focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-600">
                      Duração
                    </label>
                    <input
                      type="text"
                      value={spell.duracao ?? ""}
                      onChange={(event) =>
                        handleChange(index, { duracao: event.target.value })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1 text-xs shadow-sm focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-600">
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
                      className="w-full rounded border border-zinc-300 px-2 py-1 text-xs shadow-sm focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-600">
                      Descrição / Efeito
                    </label>
                    <textarea
                      rows={2}
                      value={spell.efeito ?? ""}
                      onChange={(event) =>
                        handleChange(index, { efeito: event.target.value })
                      }
                      className="w-full rounded border border-zinc-300 px-2 py-1 text-xs shadow-sm focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

