import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { CountryGrid } from '../components/organisms/CountryGrid';
import { Header } from '../components/organisms/Header';
import { useCountries } from '../hooks/useCountries';
import { useSearch } from '../hooks/useSearch';

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { countries, isLoading, error } = useCountries();
  const {
    query,
    region,
    filteredCountries,
    onQueryChange,
    onRegionChange,
  } = useSearch(countries);

  function handleSelect(code: string, countryName: string): void {
    navigate(`/country/${encodeURIComponent(code)}`, {
      state: { countryName },
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        query={query}
        region={region}
        onQueryChange={onQueryChange}
        onRegionChange={onRegionChange}
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
