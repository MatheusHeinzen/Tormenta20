import Link from "next/link";
import { AdBanner } from "@/components/ads/AdBanner";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-6 sm:py-10">
      <header className="space-y-2">
        <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Ficha Tormenta 20 – Sessão Rápida
        </h1>
        <p className="max-w-2xl text-sm text-ink-muted">
          Crie, edite e use fichas de personagem diretamente no navegador
        </p>
      </header>

      {/* Ad banner após o header */}
      <AdBanner position="top" />

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/sheets/new"
          className="flex flex-col justify-between rounded-md border border-border bg-paper-card p-4 shadow-sm transition hover:border-ink-muted"
        >
          <div className="space-y-1">
            <h2 className="font-serif text-base font-semibold text-ink">
              Criar nova ficha
            </h2>
            <p className="text-xs text-ink-muted">
              Comece uma ficha nova a partir do modelo básico de Tormenta 20.
            </p>
          </div>
          <span className="mt-4 text-sm font-medium text-ink">
            Começar →
          </span>
        </Link>

        <Link
          href="/sheets"
          className="flex flex-col justify-between rounded-md border border-border bg-paper-card p-4 shadow-sm transition hover:border-ink-muted"
        >
          <div className="space-y-1">
            <h2 className="font-serif text-base font-semibold text-ink">
              Fichas salvas
            </h2>
            <p className="text-xs text-ink-muted">
              Abra, edite ou apague fichas salvas neste navegador.
            </p>
          </div>
          <span className="mt-4 text-sm font-medium text-ink">
            Ver fichas →
          </span>
        </Link>

        <div className="flex flex-col justify-between rounded-md border border-dashed border-border bg-paper-card p-4 text-ink-muted">
          <div className="space-y-1">
            <h2 className="font-serif text-base font-semibold text-ink">
              Sessões em grupo
            </h2>
            <p className="text-xs">
              Planejado para o futuro: sincronizar fichas via Firebase para até
              3 jogadores verem tudo em tempo real.
            </p>
          </div>
          <span className="mt-4 text-xs">Em breve</span>
        </div>
      </section>

      {/* Ad banner antes do final da página */}
      <AdBanner position="bottom" />
    </main>
  );
}

