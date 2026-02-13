import type { CharacterSheet, InventoryItem } from "@/lib/models/character";

interface InventoryBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

function recalculateCargaUsada(itens: InventoryItem[]): number {
  return itens.reduce(
    (total, item) => total + item.quantidade * item.slots,
    0,
  );
}

export function InventoryBlock({ sheet, onChange }: InventoryBlockProps) {
  const inventario = sheet.inventario;
  const cargaPercentual =
    inventario.limiteCarga > 0
      ? Math.min(100, (inventario.cargaUsada / inventario.limiteCarga) * 100)
      : 0;

  function updateInventory(
    itens: InventoryItem[],
    limiteCarga: number,
    dinheiro: number,
  ) {
    const cargaUsada = recalculateCargaUsada(itens);
    onChange({
      ...sheet,
      inventario: {
        itens,
        limiteCarga,
        cargaUsada,
        dinheiro,
      },
    });
  }

  function handleItemChange(index: number, partial: Partial<InventoryItem>) {
    const itens = inventario.itens.map((item, idx) =>
      idx === index ? { ...item, ...partial } : item,
    );
    updateInventory(itens, inventario.limiteCarga, inventario.dinheiro);
  }

  function handleAddItem() {
    const novo: InventoryItem = {
      id: crypto.randomUUID(),
      nome: "",
      quantidade: 1,
      slots: 1,
      descricao: "",
      valor: 0,
    };
    const itens = [...inventario.itens, novo];
    updateInventory(itens, inventario.limiteCarga, inventario.dinheiro);
  }

  function handleRemoveItem(index: number) {
    const itens = inventario.itens.filter((_, idx) => idx !== index);
    updateInventory(itens, inventario.limiteCarga, inventario.dinheiro);
  }

  function handleLimiteChange(value: number) {
    updateInventory(inventario.itens, value, inventario.dinheiro);
  }

  function handleMoneyChange(value: number) {
    updateInventory(inventario.itens, inventario.limiteCarga, value);
  }

  return (
    <section className="space-y-5 rounded-md border border-border bg-paper-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-base font-semibold text-ink">Inventário</h2>
        <button
          type="button"
          onClick={handleAddItem}
          className="rounded bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90"
        >
          Adicionar item
        </button>
      </div>

      <div className="space-y-2 rounded-md border border-border bg-paper p-3 text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div>
          <span className="text-xs font-semibold text-ink-muted">
            Carga usada:
          </span>{" "}
          <span className="font-semibold text-ink">
            {inventario.cargaUsada}
          </span>
          </div>
          <div>
          <span className="text-xs font-semibold text-ink-muted">
            Limite de carga:
          </span>{" "}
          <input
            type="number"
            className="w-20 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
            value={inventario.limiteCarga}
            onChange={(event) =>
              handleLimiteChange(Number(event.target.value) || 0)
            }
          />
          </div>
          <div>
          <span className="text-xs font-semibold text-ink-muted">
            Dinheiro:
          </span>{" "}
          <input
            type="number"
            className="w-24 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
            value={inventario.dinheiro}
            onChange={(event) =>
              handleMoneyChange(Number(event.target.value) || 0)
            }
          />
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-paper-card">
          <div
            className="h-2 rounded-full bg-accent transition-all"
            style={{ width: `${cargaPercentual}%` }}
          />
        </div>
      </div>

      {inventario.itens.length === 0 ? (
        <p className="text-sm text-ink-muted">
          Nenhum item adicionado. Use &quot;Adicionar item&quot; para começar.
        </p>
      ) : (
        <div className="min-w-0 overflow-x-auto rounded-md border border-border">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="px-2 py-2 text-left text-xs font-semibold text-ink-muted">
                  Item
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-ink-muted">
                  Qtd
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-ink-muted">
                  Slots
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-ink-muted">
                  Valor
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-ink-muted">
                  Descrição
                </th>
                <th className="w-16 px-2 py-1.5" />
              </tr>
            </thead>
            <tbody>
              {inventario.itens.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-b-0 hover:bg-paper"
                >
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      value={item.nome}
                      onChange={(event) =>
                        handleItemChange(index, { nome: event.target.value })
                      }
                      placeholder="Nome do item"
                      className="w-full rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      value={item.quantidade}
                      onChange={(event) =>
                        handleItemChange(index, {
                          quantidade: Number(event.target.value) || 0,
                        })
                      }
                      className="w-16 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      value={item.slots}
                      onChange={(event) =>
                        handleItemChange(index, {
                          slots: Number(event.target.value) || 0,
                        })
                      }
                      className="w-14 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      value={item.valor ?? 0}
                      onChange={(event) =>
                        handleItemChange(index, {
                          valor: Number(event.target.value) || 0,
                        })
                      }
                      className="w-20 rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      value={item.descricao ?? ""}
                      onChange={(event) =>
                        handleItemChange(index, { descricao: event.target.value })
                      }
                      placeholder="Descrição"
                      className="w-full min-w-[180px] rounded border border-border px-2 py-1 text-sm shadow-sm focus:border-accent focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
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
    </section>
  );
}

