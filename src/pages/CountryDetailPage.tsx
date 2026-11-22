import type { JSX } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCountryDetail } from '../hooks/useCountryDetail';
import {
  formatCurrencies,
  formatLanguages,
  formatPopulation,
  getCapital,
} from '../utils/format';

export function CountryDetailPage(): JSX.Element {
  const { code } = useParams<{ code: string }>();
  const { countryDetail, isLoading, error, retry } = useCountryDetail(code);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-8">
        <Link
          to="/"
          className="inline-flex rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          ← Atrás
        </Link>

        {isLoading ? (
          <p className="mt-10 text-slate-600" role="status">
            Cargando información del país...
          </p>
        ) : error ? (
          <section
            className="mt-10 rounded-xl border border-red-200 bg-white p-6"
            role="alert"
          >
            <h1 className="text-2xl font-bold">No se pudo cargar el país</h1>
            <p className="mt-3 text-red-700">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Reintentar
            </button>
          </section>
        ) : countryDetail ? (
          <>
            <section className="mt-8 grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:items-center md:gap-12 md:p-10">
              <div className="flex min-h-56 items-center justify-center">
                {countryDetail.flags?.png || countryDetail.flags?.svg ? (
                  <img
                    src={countryDetail.flags.png ?? countryDetail.flags.svg}
                    alt={
                      countryDetail.flags.alt ||
                      `Bandera de ${countryDetail.name.common}`
                    }
                    className="max-h-64 w-full object-contain md:max-h-96"
                  />
                ) : (
                  <p className="text-slate-500">Bandera no disponible</p>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {countryDetail.name.common}
                </h1>
                <p className="mt-2 text-slate-600">
                  {countryDetail.name.official ?? countryDetail.name.common}
                </p>
                <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold">Capital</dt>
                    <dd className="text-slate-600">{getCapital(countryDetail)}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Región</dt>
                    <dd className="text-slate-600">{countryDetail.region}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Subregión</dt>
                    <dd className="text-slate-600">
                      {countryDetail.subregion || 'Sin subregión'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Población</dt>
                    <dd className="text-slate-600">
                      {formatPopulation(countryDetail.population)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Moneda</dt>
                    <dd className="text-slate-600">
                      {formatCurrencies(countryDetail.currencies)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Idiomas</dt>
                    <dd className="text-slate-600">
                      {formatLanguages(countryDetail.languages)}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="mt-10" aria-labelledby="border-countries">
              <h2 id="border-countries" className="mb-4 text-2xl font-bold">
                Países fronterizos
              </h2>
              {countryDetail.borderCountries.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {countryDetail.borderCountries.map((border) => (
                    <Link
                      key={border.code}
                      to={`/country/${encodeURIComponent(border.routeCode)}`}
                      aria-label={`Ver detalle de ${border.name} (${border.code})`}
                      className="rounded-lg border border-white bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm hover:border-blue-200 hover:text-blue-700"
                    >
                      {border.code}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">
                  Este país no tiene países fronterizos.
                </p>
              )}
            </section>
          </>
        ) : null}
      </main>
      <footer className="mt-10 bg-blue-700 px-6 py-6 text-center text-white">
        Explorer App
      </footer>
    </div>
  );
}
