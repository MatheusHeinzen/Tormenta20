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

  function updateInventory(itens: InventoryItem[], limiteCarga: number) {
    const cargaUsada = recalculateCargaUsada(itens);
    onChange({
      ...sheet,
      inventario: {
        itens,
        limiteCarga,
        cargaUsada,
      },
    });
  }

  function handleItemChange(index: number, partial: Partial<InventoryItem>) {
    const itens = inventario.itens.map((item, idx) =>
      idx === index ? { ...item, ...partial } : item,
    );
    updateInventory(itens, inventario.limiteCarga);
  }

  function handleAddItem() {
    const novo: InventoryItem = {
      id: crypto.randomUUID(),
      nome: "",
      quantidade: 1,
      slots: 1,
    };
    const itens = [...inventario.itens, novo];
    updateInventory(itens, inventario.limiteCarga);
  }

  function handleRemoveItem(index: number) {
    const itens = inventario.itens.filter((_, idx) => idx !== index);
    updateInventory(itens, inventario.limiteCarga);
  }

  function handleLimiteChange(value: number) {
    updateInventory(inventario.itens, value);
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">Inventário</h2>
        <button
          type="button"
          onClick={handleAddItem}
          className="rounded border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
        >
          Adicionar item
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-md bg-zinc-50 p-3 text-sm">
        <div>
          <span className="font-medium text-zinc-700">Carga usada:</span>{" "}
          <span className="text-zinc-900">{inventario.cargaUsada}</span>
        </div>
        <div>
          <span className="font-medium text-zinc-700">Limite de carga:</span>{" "}
          <input
            type="number"
            className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
            value={inventario.limiteCarga}
            onChange={(event) =>
              handleLimiteChange(Number(event.target.value) || 0)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        {inventario.itens.length === 0 && (
          <p className="text-sm text-zinc-500">
            Nenhum item adicionado. Use &quot;Adicionar item&quot; para começar.
          </p>
        )}

        {inventario.itens.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 md:grid-cols-[2fr_repeat(2,1fr)_auto]"
          >
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">
                Item
              </label>
              <input
                type="text"
                value={item.nome}
                onChange={(event) =>
                  handleItemChange(index, { nome: event.target.value })
                }
                className="w-full rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">
                Quantidade
              </label>
              <input
                type="number"
                min={0}
                value={item.quantidade}
                onChange={(event) =>
                  handleItemChange(index, {
                    quantidade: Number(event.target.value) || 0,
                  })
                }
                className="w-full rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-700">
                Slots
              </label>
              <input
                type="number"
                min={0}
                value={item.slots}
                onChange={(event) =>
                  handleItemChange(index, {
                    slots: Number(event.target.value) || 0,
                  })
                }
                className="w-full rounded border border-zinc-300 px-2 py-1 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <div className="flex items-end justify-end">
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

