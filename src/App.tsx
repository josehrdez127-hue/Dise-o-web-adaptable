import type { JSX } from 'react';
import { CountryGrid } from './components/organisms/CountryGrid';
import { Header } from './components/organisms/Header';
import { countriesDemo } from './data/countries-demo';

export default function App(): JSX.Element {
  function handleSelect(code: string): void {
    console.log(code);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Header>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
            Explorer App · Unidad 03
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl font-semibold text-primary dark:text-white sm:text-5xl">
                Países del mundo
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-600 dark:text-slate-300">
                Un listado de países compuesto con componentes reutilizables.
              </p>
            </div>
            <span className="border-l-2 border-amber-600 pl-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              {countriesDemo.length} países de ejemplo
            </span>
          </div>
        </Header>
        <CountryGrid countries={countriesDemo} onSelect={handleSelect} />
      </div>
    </main>
  );
}
