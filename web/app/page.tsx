import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">
          Ficha Tormenta 20 – Sessão Rápida
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Crie, edite e use fichas de personagem diretamente no navegador. Os
          dados ficam salvos no seu dispositivo (localStorage), prontos para
          futuramente sincronizar com Firebase para uso em grupo.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/sheets/new"
          className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-400"
        >
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900">
              Criar nova ficha
            </h2>
            <p className="text-xs text-zinc-600">
              Comece uma ficha nova a partir do modelo básico de Tormenta 20.
            </p>
          </div>
          <span className="mt-4 text-sm font-medium text-zinc-800">
            Começar →
          </span>
        </Link>

        <Link
          href="/sheets"
          className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-400"
        >
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900">
              Fichas salvas
            </h2>
            <p className="text-xs text-zinc-600">
              Abra, edite ou apague fichas salvas neste navegador.
            </p>
          </div>
          <span className="mt-4 text-sm font-medium text-zinc-800">
            Ver fichas →
          </span>
        </Link>

        <div className="flex flex-col justify-between rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4 text-zinc-500">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-800">
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
    </main>
  );
}

