import type { JSX } from 'react';
import type { Country } from '../../types/country';
import { formatPopulation, getCapital } from '../../utils/format';
import { Badge } from '../atoms/Badge';
import { Flag } from '../atoms/Flag';

interface CountryCardProps {
  country: Country;
  onSelect: (code: string) => void;
}

export function CountryCard({ country, onSelect }: CountryCardProps): JSX.Element {
  const flagUrl = country.flags?.png || country.flags?.svg || '';
  const countryCode = country.cca2 ?? country.name.common;
  const subregionNames: Record<string, string> = {
    'Central America': 'América Central',
  };
  const subregionName = country.subregion
    ? subregionNames[country.subregion] ?? country.subregion
    : '';

  return (
    <article className="@container block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Flag
        src={flagUrl}
        alt={country.flags?.alt || `Bandera de ${country.name.common}`}
      />
      <div className="p-5">
        <h2 className="country-card-title mb-4 text-xl font-bold">
          {country.name.common}
        </h2>
        <div className="grid grid-cols-1 @sm:grid-cols-2!">
          <p className="country-card-copy mb-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Región:</span>{' '}
            <Badge region={country.region} />
          </p>
          {subregionName && (
            <p className="country-card-copy mb-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Subregión:</span>{' '}
              {subregionName}
            </p>
          )}
          <p className="country-card-copy mb-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Capital:</span>{' '}
            {getCapital(country)}
          </p>
          <p className="country-card-copy text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Población:</span>{' '}
            {formatPopulation(country.population)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(countryCode)}
          aria-label={`Seleccionar ${country.name.common}`}
          className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Seleccionar país
        </button>
      </div>
    </article>
  );
}