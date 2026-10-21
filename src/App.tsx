import type { JSX } from 'react';
import { Search } from 'lucide-react';
import { CountryGrid } from './components/organisms/CountryGrid';
import { Header } from './components/organisms/Header';
import { countriesDemo } from './data/countries-demo';

export default function App(): JSX.Element {
  function handleSelect(code: string): void {
    console.log(code);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header>Explorer App</Header>
      <main className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <section id="inicio" className="mb-10">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            Explorar países del mundo
          </h1>
          <p className="text-base text-slate-600">
            Busca un país o filtra por región para consultar su información
          </p>
        </section>

        <section className="mb-10 flex flex-col justify-between gap-5 md:flex-row" aria-label="Filtros de países">
          <label className="relative w-full md:w-[30rem]">
            <span className="sr-only">Buscar país</span>
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Escriba el nombre del país..."
              className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label>
            <span className="sr-only">Filtrar por región</span>
            <select
              defaultValue="all"
              className="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-60"
            >
              <option value="all">Busque por región</option>
              <option value="Americas">América</option>
              <option value="Central America">América Central</option>
              <option value="Europe">Europa</option>
              <option value="Asia">Asia</option>
              <option value="Africa">África</option>
              <option value="Oceania">Oceanía</option>
            </select>
          </label>
        </section>

        <div id="paises">
          <CountryGrid countries={countriesDemo} onSelect={handleSelect} />
        </div>
        <span id="acerca" className="sr-only">Explorer App</span>
      </main>
    </div>
  );
}
