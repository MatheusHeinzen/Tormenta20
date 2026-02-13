import type { AbilityScoreName, CharacterSheet } from "@/lib/models/character";
import { abilityModifier } from "@/lib/models/character";
import { getConjuradorMagiaInfo } from "@/lib/t20/class";

interface CombatBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

export function CombatBlock({ sheet, onChange }: CombatBlockProps) {
  function handleChange(
    key: keyof CharacterSheet["combate"],
    value: number,
  ): void {
    onChange({
      ...sheet,
      combate: {
        ...sheet.combate,
        [key]: value,
      },
    });
  }

  const combate = sheet.combate;
  const config = sheet.config;

  const atributoHp: AbilityScoreName = config?.derived.atributoHp ?? "constituicao";
  const atributoDefesa: AbilityScoreName =
    config?.derived.atributoDefesa ?? "destreza";

  const atributoHpValor = sheet.atributos[atributoHp];
  const atributoDefesaValor = sheet.atributos[atributoDefesa];

  const atributoHpMod = abilityModifier(atributoHpValor);
  const atributoDefesaMod = abilityModifier(atributoDefesaValor);

  const ataques = sheet.ataques ?? [];
  const proficiencias = sheet.proficiencias;

  const caCalculada =
    10 +
    atributoDefesaMod +
    (proficiencias?.armadura?.defesa ?? 0) +
    (proficiencias?.escudo?.defesa ?? 0) +
    (combate.caBonus ?? 0);
  const magia = sheet.magia;

  const classesResumo =
    sheet.classes && sheet.classes.length > 0
      ? sheet.classes.map((klass) => `${klass.nome} ${klass.nivel}`).join(" / ")
      : sheet.classePrincipal
        ? `${sheet.classePrincipal} ${sheet.nivel}`
        : "Sem classe";

  const nivelTotal =
    sheet.classes && sheet.classes.length > 0
      ? sheet.classes.reduce((total, klass) => total + klass.nivel, 0)
      : sheet.nivel;
  const conjuradorMagia = getConjuradorMagiaInfo(sheet);

  function updateProficiencias(
    partial: Partial<typeof proficiencias>,
  ): void {
    onChange({
      ...sheet,
      proficiencias: {
        ...proficiencias,
        ...partial,
      },
    });
  }

  function updateArmadura(
    partial: Partial<typeof proficiencias.armadura>,
  ): void {
    updateProficiencias({
      armadura: {
        ...proficiencias.armadura,
        ...partial,
      },
    });
  }

  function updateEscudo(
    partial: Partial<typeof proficiencias.escudo>,
  ): void {
    updateProficiencias({
      escudo: {
        ...proficiencias.escudo,
        ...partial,
      },
    });
  }

  function updateArmas(
    partial: Partial<typeof proficiencias.armas>,
  ): void {
    updateProficiencias({
      armas: {
        ...proficiencias.armas,
        ...partial,
      },
    });
  }

  function updateSentidos(
    partial: Partial<typeof proficiencias.sentidos>,
  ): void {
    updateProficiencias({
      sentidos: {
        ...proficiencias.sentidos,
        ...partial,
      },
    });
  }

  function updateMagia(partial: Partial<typeof magia>): void {
    onChange({
      ...sheet,
      magia: {
        ...magia,
        ...partial,
      },
    });
  }

  function handleAttackChange(
    index: number,
    partial: Partial<typeof ataques[number]>,
  ) {
    const next = ataques.map((attack, idx) =>
      idx === index ? { ...attack, ...partial } : attack,
    );
    onChange({
      ...sheet,
      ataques: next,
    });
  }

  function handleAddAttack() {
    const novo = {
      id: crypto.randomUUID(),
      nome: "",
      teste: "For/Des",
      bonusAtaque: 0,
      dano: "1d4",
      critico: 20,
      tipo: "Perfuração",
      alcance: "Curto",
    };
    onChange({
      ...sheet,
      ataques: [...ataques, novo],
    });
  }

  function handleRemoveAttack(index: number) {
    const next = ataques.filter((_, idx) => idx !== index);
    onChange({
      ...sheet,
      ataques: next,
    });
  }

  function handleConfigChange(
    key: keyof typeof config.derived,
    value: AbilityScoreName,
  ) {
    const nextConfig = {
      ...config,
      derived: {
        ...config.derived,
        [key]: value,
      },
    };

    onChange({
      ...sheet,
      config: nextConfig,
    });
  }

  return (
    <section className="w-full max-w-full min-w-0 space-y-5 overflow-x-hidden rounded-md border border-border bg-paper-card p-5 shadow-sm">
      <h2 className="font-serif text-base font-semibold text-ink">Combate</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5 rounded-md border border-border bg-paper p-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            Pontos de Vida
          </h3>
          <div className="flex items-center gap-2">
            <label className="flex flex-1 flex-col text-xs text-ink-muted">
              Atual
              <input
                type="number"
                className="mt-0.5 rounded border border-border px-2 py-0.5 text-sm font-semibold shadow-sm focus:border-accent focus:outline-none"
                value={combate.pvAtual}
                onChange={(event) =>
                  handleChange("pvAtual", Number(event.target.value) || 0)
                }
              />
            </label>
            <span className="mt-4 text-xs text-ink-muted">/</span>
            <label className="flex flex-1 flex-col text-xs text-ink-muted">
              Máximo
              <input
                type="number"
                className="mt-0.5 rounded border border-border px-2 py-0.5 text-sm font-semibold shadow-sm focus:border-accent focus:outline-none"
                value={combate.pvMaximo}
                onChange={(event) =>
                  handleChange("pvMaximo", Number(event.target.value) || 0)
                }
              />
            </label>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-semibold text-ink-muted">
              Atributo:
            </label>
            <select
              value={atributoHp}
              onChange={(event) =>
                handleConfigChange("atributoHp", event.target.value as AbilityScoreName)
              }
              className="rounded border border-border bg-paper-card px-1.5 py-0.5 text-[11px] shadow-sm focus:border-accent focus:outline-none"
            >
              <option value="forca">Força</option>
              <option value="destreza">Destreza</option>
              <option value="constituicao">Constituição</option>
              <option value="inteligencia">Inteligência</option>
              <option value="sabedoria">Sabedoria</option>
              <option value="carisma">Carisma</option>
            </select>
            <span className="text-[11px] text-ink-muted">
              ({atributoHpMod >= 0 ? `+${atributoHpMod}` : atributoHpMod})
            </span>
          </div>
        </div>

        <div className="space-y-1.5 rounded-md border border-border bg-paper p-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            Pontos de Mana
          </h3>
          <div className="flex items-center gap-2">
            <label className="flex flex-1 flex-col text-xs text-ink-muted">
              Atual
              <input
                type="number"
                className="mt-0.5 rounded border border-border px-2 py-0.5 text-sm font-semibold shadow-sm focus:border-accent focus:outline-none"
                value={combate.pmAtual}
                onChange={(event) =>
                  handleChange("pmAtual", Number(event.target.value) || 0)
                }
              />
            </label>
            <span className="mt-4 text-xs text-ink-muted">/</span>
            <label className="flex flex-1 flex-col text-xs text-ink-muted">
              Máximo
              <input
                type="number"
                className="mt-0.5 rounded border border-border px-2 py-0.5 text-sm font-semibold shadow-sm focus:border-accent focus:outline-none"
                value={combate.pmMaximo}
                onChange={(event) =>
                  handleChange("pmMaximo", Number(event.target.value) || 0)
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="min-w-0 space-y-2 rounded-md border border-border bg-paper p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-semibold text-ink">
              Classe de Armadura (CA)
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={atributoDefesa}
                onChange={(event) =>
                  handleConfigChange(
                    "atributoDefesa",
                    event.target.value as AbilityScoreName,
                  )
                }
                className="rounded border border-border bg-paper-card px-1.5 py-0.5 text-[11px] shadow-sm focus:border-accent focus:outline-none"
              >
                <option value="forca">For</option>
                <option value="destreza">Des</option>
                <option value="constituicao">Con</option>
                <option value="inteligencia">Int</option>
                <option value="sabedoria">Sab</option>
                <option value="carisma">Car</option>
              </select>
              <span className="text-[11px] text-ink-muted">
                {atributoDefesaMod >= 0 ? `+${atributoDefesaMod}` : atributoDefesaMod}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-ink-muted">
            10 + {atributoDefesaMod >= 0 ? `+${atributoDefesaMod}` : atributoDefesaMod} (atributo) + {proficiencias?.armadura?.defesa ?? 0} (armadura) + {proficiencias?.escudo?.defesa ?? 0} (escudo) + {combate.caBonus ?? 0} (bônus)
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold tabular-nums text-ink">
              {caCalculada}
            </span>
            <label className="flex items-center gap-1.5 text-xs text-ink-muted">
              Bônus
              <input
                type="number"
                className="w-14 rounded border border-border px-1.5 py-0.5 text-sm shadow-sm focus:border-accent focus:outline-none"
                value={combate.caBonus ?? 0}
                onChange={(event) =>
                  onChange({
                    ...sheet,
                    combate: {
                      ...sheet.combate,
                      caBonus: Number(event.target.value) || 0,
                    },
                  })
                }
              />
            </label>
          </div>
        </div>

        <div className="min-w-0 space-y-1">
          <label className="block text-xs font-semibold text-ink-muted">
            Penalidade armadura
          </label>
          <p className="text-[11px] text-ink-muted">
            Armadura ({proficiencias?.armadura?.penalidade ?? 0}) + Escudo (
            {proficiencias?.escudo?.penalidade ?? 0})
          </p>
          <p className="text-lg font-semibold tabular-nums text-ink">
            {(proficiencias?.armadura?.penalidade ?? 0) +
              (proficiencias?.escudo?.penalidade ?? 0)}
          </p>
        </div>

        <div className="min-w-0 space-y-1">
          <label className="block text-xs font-semibold text-ink-muted">
            Deslocamento (m)
          </label>
          <input
            type="number"
            className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
            value={combate.deslocamento}
            onChange={(event) =>
              handleChange("deslocamento", Number(event.target.value) || 0)
            }
          />
        </div>
      </div>

      <section className="space-y-4 rounded-md border border-border bg-paper-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-ink">
          Proficiências e Armaduras
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-red-600">ARMADURA</h4>
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-ink-muted">
                Tipo
              </label>
              <input
                type="text"
                value={proficiencias.armadura.tipo}
                onChange={(event) => updateArmadura({ tipo: event.target.value })}
                placeholder="Ex: Couro"
                className="w-full rounded border border-border bg-paper-card px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Defesa
                </label>
                <input
                  type="number"
                  value={proficiencias.armadura.defesa}
                  onChange={(event) =>
                    updateArmadura({
                      defesa: Number(event.target.value) || 0,
                    })
                  }
                  className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Penal.
                </label>
                <input
                  type="number"
                  value={proficiencias.armadura.penalidade}
                  onChange={(event) =>
                    updateArmadura({
                      penalidade: Number(event.target.value) || 0,
                    })
                  }
                  className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Proficiência
                </label>
                <input
                  type="text"
                  value={proficiencias.armadura.proficiencia}
                  onChange={(event) =>
                    updateArmadura({ proficiencia: event.target.value })
                  }
                  className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-red-600">ESCUDO</h4>
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-ink-muted">
                Tipo
              </label>
              <input
                type="text"
                value={proficiencias.escudo.tipo}
                onChange={(event) => updateEscudo({ tipo: event.target.value })}
                placeholder="Ex: Escudo Leve"
                className="w-full rounded border border-border bg-paper-card px-3 py-2 text-sm shadow-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Defesa
                </label>
                <input
                  type="number"
                  value={proficiencias.escudo.defesa}
                  onChange={(event) =>
                    updateEscudo({
                      defesa: Number(event.target.value) || 0,
                    })
                  }
                  className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Penal.
                </label>
                <input
                  type="number"
                  value={proficiencias.escudo.penalidade}
                  onChange={(event) =>
                    updateEscudo({
                      penalidade: Number(event.target.value) || 0,
                    })
                  }
                  className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Proficiência
                </label>
                <input
                  type="text"
                  value={proficiencias.escudo.proficiencia}
                  onChange={(event) =>
                    updateEscudo({ proficiencia: event.target.value })
                  }
                  className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-md border border-border bg-paper-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-ink">
          Armas e Sentidos
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-ink">ARMAS</h4>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={proficiencias.armas.simples}
                onChange={(event) =>
                  updateArmas({ simples: event.target.checked })
                }
              />
              Simples
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={proficiencias.armas.marciais}
                onChange={(event) =>
                  updateArmas({ marciais: event.target.checked })
                }
              />
              Marciais
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={proficiencias.armas.exoticas}
                onChange={(event) =>
                  updateArmas({ exoticas: event.target.checked })
                }
              />
              Exóticas
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={proficiencias.armas.deFogo}
                onChange={(event) =>
                  updateArmas({ deFogo: event.target.checked })
                }
              />
              De Fogo
            </label>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-ink">SENTIDOS</h4>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={proficiencias.sentidos.visaoPenumbra}
                onChange={(event) =>
                  updateSentidos({ visaoPenumbra: event.target.checked })
                }
              />
              Visão na Penumbra
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={proficiencias.sentidos.visaoEscuro}
                onChange={(event) =>
                  updateSentidos({ visaoEscuro: event.target.checked })
                }
              />
              Visão no Escuro
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={proficiencias.sentidos.visaoMistica}
                onChange={(event) =>
                  updateSentidos({ visaoMistica: event.target.checked })
                }
              />
              Visão mística
            </label>
            <input
              type="text"
              value={proficiencias.sentidos.outros}
              onChange={(event) =>
                updateSentidos({ outros: event.target.value })
              }
              placeholder="Outro(s) sentido(s)"
              className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-ink">
              PROFICIÊNCIAS
            </h4>
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Armaduras
                </label>
                <input
                  type="text"
                  value={proficiencias.armadura.proficiencia}
                  onChange={(event) =>
                    updateArmadura({ proficiencia: event.target.value })
                  }
                  className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Escudos
                </label>
                <input
                  type="text"
                  value={proficiencias.escudo.proficiencia}
                  onChange={(event) =>
                    updateEscudo({ proficiencia: event.target.value })
                  }
                  className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-3 rounded-md border border-border bg-paper p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink">Ataques</h3>
          <button
            type="button"
            onClick={handleAddAttack}
            className="rounded bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90"
          >
            Adicionar ataque
          </button>
        </div>

        {ataques.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Nenhum ataque cadastrado. Use &quot;Adicionar ataque&quot; para começar.
          </p>
        ) : (
          <div className="min-w-0 overflow-x-auto rounded-md border border-border bg-paper-card">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-paper text-xs font-semibold text-ink-muted">
                  <th className="px-2 py-2 text-left">Nome</th>
                  <th className="px-2 py-2 text-left">Teste</th>
                  <th className="px-2 py-2 text-left">Bônus</th>
                  <th className="px-2 py-2 text-left">Dano</th>
                  <th className="px-2 py-2 text-left">Crítico</th>
                  <th className="px-2 py-2 text-left">Tipo</th>
                  <th className="px-2 py-2 text-left">Alcance</th>
                  <th className="w-16 px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {ataques.map((attack, index) => (
                  <tr
                    key={attack.id}
                    className="border-b border-border last:border-b-0 hover:bg-paper"
                  >
                    <td className="px-2 py-1">
                      <input
                        type="text"
                        value={attack.nome}
                        onChange={(event) =>
                          handleAttackChange(index, { nome: event.target.value })
                        }
                        placeholder="Espada"
                        className="w-full min-w-[140px] rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="text"
                        value={attack.teste}
                        onChange={(event) =>
                          handleAttackChange(index, { teste: event.target.value })
                        }
                        className="w-24 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={attack.bonusAtaque}
                        onChange={(event) =>
                          handleAttackChange(index, {
                            bonusAtaque: Number(event.target.value) || 0,
                          })
                        }
                        className="w-16 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="text"
                        value={attack.dano}
                        onChange={(event) =>
                          handleAttackChange(index, { dano: event.target.value })
                        }
                        className="w-20 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={attack.critico}
                        onChange={(event) =>
                          handleAttackChange(index, {
                            critico: Number(event.target.value) || 0,
                          })
                        }
                        className="w-16 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="text"
                        value={attack.tipo}
                        onChange={(event) =>
                          handleAttackChange(index, { tipo: event.target.value })
                        }
                        className="w-24 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="text"
                        value={attack.alcance}
                        onChange={(event) =>
                          handleAttackChange(index, {
                            alcance: event.target.value,
                          })
                        }
                        className="w-24 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handleRemoveAttack(index)}
                        className="rounded border border-red-200 bg-paper-card px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <section className="space-y-3 rounded-md border border-border bg-paper-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-ink">
          Magia e Resistências
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-border bg-paper p-3">
            <p className="text-[11px] font-semibold text-ink-muted">
              CD DE MAGIA
            </p>
            {conjuradorMagia && (
              <p className="mt-1 text-[10px] text-ink-muted">
                Sugerido pela classe: {conjuradorMagia.cdBase}
              </p>
            )}
            <input
              type="number"
              value={magia.cd}
              onChange={(event) =>
                updateMagia({ cd: Number(event.target.value) || 0 })
              }
              className="mt-2 w-full rounded border border-border bg-paper-card px-2 py-1 text-sm font-semibold shadow-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div className="rounded-md border border-border bg-paper p-3">
            <p className="text-[11px] font-semibold text-ink-muted">
              NÍVEL TOTAL
            </p>
            <p className="mt-2 text-lg font-semibold text-ink">
              {nivelTotal}
            </p>
          </div>
          <div className="rounded-md border border-border bg-paper p-3">
            <p className="text-[11px] font-semibold text-ink-muted">CLASSE</p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {classesResumo}
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

