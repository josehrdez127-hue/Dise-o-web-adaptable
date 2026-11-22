import type { JSX } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

interface CountryNavigationState {
  countryName: string;
}

function isCountryNavigationState(
  value: unknown,
): value is CountryNavigationState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'countryName' in value &&
    typeof value.countryName === 'string'
  );
}

export function CountryDetailPage(): JSX.Element {
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const countryName = isCountryNavigationState(location.state)
    ? location.state.countryName
    : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <Link
          to="/"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Volver a explorar países
        </Link>
        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            Detalle del país
          </h1>
          <p className="text-base text-slate-600">
            País seleccionado:{' '}
            <span className="font-semibold text-slate-900">
              {countryName ?? `código ${code ?? 'desconocido'}`}
            </span>
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Código del país: {code ?? 'desconocido'}
          </p>
          <p className="mt-6 text-slate-600">
            La información completa del país estará disponible próximamente.
          </p>
        </section>
      </div>
    </main>
  );
}
