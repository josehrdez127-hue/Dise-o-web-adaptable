import type { Country } from '../types/country';

export function formatPopulation(value: number | undefined): string {
  return value === undefined ? 'Sin datos' : value.toLocaleString('es-SV');
}

export function getCapital(country: Country): string {
  return country.capital?.[0] || 'Sin capital';
}
