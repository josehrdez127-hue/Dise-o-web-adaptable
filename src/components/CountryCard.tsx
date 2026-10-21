import type { JSX } from 'react';
import type { Country } from '../types/country';
import { formatPopulation } from '../utils/format';

interface CountryCardProps {
  country: Country;
}

const regionNames: Record<string, string> = {
  Africa: 'África',
  Americas: 'América',
  Asia: 'Asia',
  Europe: 'Europa',
  Oceania: 'Oceanía',
};

export function CountryCard({ country }: CountryCardProps): JSX.Element {
  const flagUrl = country.flags?.png || country.flags?.svg || '';
  const regionName = regionNames[country.region] ?? country.region;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <img
        src={flagUrl}
        alt={country.flags?.alt || `Bandera de ${country.name.common}`}
        className="h-48 w-full object-cover"
        loading="lazy"
      />
      <div className="p-5">
        <h2 className="font-heading mb-4 text-xl font-semibold text-primary dark:text-white">
          {country.name.common}
        </h2>
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">Región:</span>{' '}
          {regionName}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">Población:</span>{' '}
          {formatPopulation(country.population)}
        </p>
      </div>
    </article>
  );
}
