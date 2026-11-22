import type { Country } from '../types/country';

export function formatPopulation(value: number | undefined): string {
  return value === undefined ? 'Sin datos' : value.toLocaleString('es-SV');
}

export function getCapital(country: Country): string {
  return country.capital?.[0] || 'Sin capital';
}

export function formatCurrencies(
  currencies: Country['currencies'],
): string {
  if (!currencies) return 'Sin datos';

  const formattedCurrencies = Object.values(currencies).map(({ name, symbol }) =>
    symbol ? `${name} (${symbol})` : name,
  );

  return formattedCurrencies.join(', ') || 'Sin datos';
}

export function formatLanguages(languages: Country['languages']): string {
  if (!languages) return 'Sin datos';
  return Object.values(languages).join(', ') || 'Sin datos';
}
