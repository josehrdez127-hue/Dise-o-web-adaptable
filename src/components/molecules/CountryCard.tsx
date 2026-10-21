import type { JSX } from 'react';
import type { Country } from '../../types/country';
import { formatPopulation } from '../../utils/format';
import { Badge } from '../atoms/Badge';
import { Flag } from '../atoms/Flag';

interface CountryCardProps {
  country: Country;
  onSelect: (code: string) => void;
}

export function CountryCard({ country, onSelect }: CountryCardProps): JSX.Element {
  const flagUrl = country.flags?.png || country.flags?.svg || '';
  const countryCode = country.cca2 ?? country.name.common;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <Flag
        src={flagUrl}
        alt={country.flags?.alt || `Bandera de ${country.name.common}`}
      />
      <div className="p-5">
        <h2 className="font-heading mb-3 text-xl font-semibold text-primary dark:text-white">
          {country.name.common}
        </h2>
        <div className="mb-4">
          <Badge region={country.region} />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">Población:</span>{' '}
          {formatPopulation(country.population)}
        </p>
        <button
          type="button"
          onClick={() => onSelect(countryCode)}
          aria-label={`Seleccionar ${country.name.common}`}
          className="mt-5 w-full rounded-md border border-primary px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-slate-400 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Seleccionar país
        </button>
      </div>
    </article>
  );
}