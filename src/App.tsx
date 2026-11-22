import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { CountryGrid } from './components/organisms/CountryGrid';
import { Header } from './components/organisms/Header';
import type { RegionFilterValue } from './components/molecules/RegionFilter';
import type { Country } from './types/country';
import { fetchCountries } from './services/countries';

export default function App(): JSX.Element {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<RegionFilterValue>('all');

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries(): Promise<void> {
      try {
        const result = await fetchCountries(controller.signal);
        setCountries(result);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Ocurrió un error inesperado al cargar los países.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadCountries();

    return () => controller.abort();
  }, []);

  const filteredCountries = countries.filter((country) => {
    const matchesQuery = country.name.common
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase());
    const matchesRegion = region === 'all' || country.region === region;

    return matchesQuery && matchesRegion;
  });

  function handleSelect(code: string): void {
    console.log(code);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        query={query}
        region={region}
        onQueryChange={setQuery}
        onRegionChange={setRegion}
      >
        Explorer App
      </Header>
      <main className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <section id="inicio" className="mb-10">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            Explorar países del mundo
          </h1>
          <p className="text-base text-slate-600">
            Busca un país o filtra por región para consultar su información
          </p>
        </section>

        <div id="paises">
          {isLoading ? (
            <p className="text-slate-600" role="status">
              Cargando países...
            </p>
          ) : error ? (
            <p className="text-red-700" role="alert">
              No se pudieron cargar los países. {error}
            </p>
          ) : filteredCountries.length > 0 ? (
            <CountryGrid countries={filteredCountries} onSelect={handleSelect} />
          ) : (
            <p className="text-slate-600" role="status">
              No se encontraron países con esos filtros.
            </p>
          )}
        </div>
        <span id="acerca" className="sr-only">Explorer App</span>
      </main>
    </div>
  );
}
