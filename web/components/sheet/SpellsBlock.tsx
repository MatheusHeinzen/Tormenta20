import type { CharacterSheet } from "@/lib/models/character";

interface SpellsBlockProps {
  sheet: CharacterSheet;
  onChange(next: CharacterSheet): void;
}

export function SpellsBlock({ sheet, onChange }: SpellsBlockProps) {
  // MVP: campo livre para magias, mantendo espaço para evoluir para tabela estruturada.
  const textoMagias =
    sheet.magias.length === 0
      ? ""
      : sheet.magias.map((spell) => `${spell.nome} – ${spell.efeito ?? ""}`).join("\n");

  function handleChange(value: string) {
    if (!value.trim()) {
      onChange({
        ...sheet,
        magias: [],
      });
      return;
    }

    const linhas = value.split("\n");
    const magias = linhas.map((linha, index) => {
      const [nomeBruto, efeitoBruto] = linha.split("–");
      const nome = (nomeBruto ?? "").trim();
      const efeito = (efeitoBruto ?? "").trim();

      return {
        id: `${index}-${nome}`,
        nome,
        efeito: efeito || undefined,
      };
    });

    onChange({
      ...sheet,
      magias,
    });
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Magias (livre)</h2>
      <p className="text-xs text-zinc-500">
        Você pode descrever suas magias linha a linha. Exemplo:{" "}
        <span className="font-mono text-[11px]">
          Bola de Fogo – 6d6 de dano em área.
        </span>
      </p>
      <textarea
        rows={6}
        value={textoMagias}
        onChange={(event) => handleChange(event.target.value)}
        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-600 focus:outline-none"
      />
    </section>
  );
}

