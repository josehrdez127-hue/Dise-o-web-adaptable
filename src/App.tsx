import type { JSX } from 'react';
import { CountryCard } from './components/CountryCard';
import { paisDos, paisTres, paisUno } from './data/countries-demo';

export default function App(): JSX.Element {
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-9 border-b border-slate-300 pb-7 dark:border-slate-700">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
            Explorer App · Unidad 03
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl font-semibold text-primary dark:text-white sm:text-5xl">
                Países del mundo
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-600 dark:text-slate-300">
                Mi primera tarjeta reutilizable con React y TypeScript.
              </p>
            </div>
            <span className="border-l-2 border-amber-600 pl-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              3 países de ejemplo
            </span>
          </div>
        </header>

        <section
          aria-label="Países de ejemplo"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <CountryCard country={paisUno} />
          <CountryCard country={paisDos} />
          <CountryCard country={paisTres} />
        </section>
      </div>
    </main>
  );
}
