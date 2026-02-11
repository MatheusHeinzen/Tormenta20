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
    <section className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900">Inventário</h2>
        <button
          type="button"
          onClick={handleAddItem}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800"
        >
          Adicionar item
        </button>
      </div>

      <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div>
          <span className="text-xs font-semibold text-zinc-500">
            Carga usada:
          </span>{" "}
          <span className="font-semibold text-zinc-900">
            {inventario.cargaUsada}
          </span>
          </div>
          <div>
          <span className="text-xs font-semibold text-zinc-500">
            Limite de carga:
          </span>{" "}
          <input
            type="number"
            className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
            value={inventario.limiteCarga}
            onChange={(event) =>
              handleLimiteChange(Number(event.target.value) || 0)
            }
          />
          </div>
          <div>
          <span className="text-xs font-semibold text-zinc-500">
            Dinheiro:
          </span>{" "}
          <input
            type="number"
            className="w-24 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
            value={inventario.dinheiro}
            onChange={(event) =>
              handleMoneyChange(Number(event.target.value) || 0)
            }
          />
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-white">
          <div
            className="h-2 rounded-full bg-zinc-900 transition-all"
            style={{ width: `${cargaPercentual}%` }}
          />
        </div>
      </div>

      {inventario.itens.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nenhum item adicionado. Use &quot;Adicionar item&quot; para começar.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-2 py-2 text-left text-xs font-semibold text-zinc-600">
                  Item
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-zinc-600">
                  Qtd
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-zinc-600">
                  Slots
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-zinc-600">
                  Valor
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-zinc-600">
                  Descrição
                </th>
                <th className="w-16 px-2 py-1.5" />
              </tr>
            </thead>
            <tbody>
              {inventario.itens.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50"
                >
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      value={item.nome}
                      onChange={(event) =>
                        handleItemChange(index, { nome: event.target.value })
                      }
                      placeholder="Nome do item"
                      className="w-full rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
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
                      className="w-16 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
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
                      className="w-14 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
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
                      className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
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
                      className="w-full min-w-[180px] rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
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

