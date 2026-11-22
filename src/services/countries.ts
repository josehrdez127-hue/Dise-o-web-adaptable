import type { Country, CountriesResponse, CountryFlags } from '../types/country';

const COUNTRIES_URL =
  'https://www.apicountries.com/countries';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function parseCountry(value: unknown): Country | null {
  if (
    !isRecord(value) ||
    typeof value.name !== 'string' ||
    typeof value.population !== 'number' ||
    typeof value.region !== 'string'
  ) {
    return null;
  }

  const country: Country = {
    name: { common: value.name },
    population: value.population,
    region: value.region,
  };

  if (typeof value.alpha2Code === 'string') country.cca2 = value.alpha2Code;
  if (typeof value.alpha3Code === 'string') country.cca3 = value.alpha3Code;
  if (typeof value.subregion === 'string') country.subregion = value.subregion;
  if (isStringArray(value.capital)) country.capital = value.capital;
  if (typeof value.capital === 'string' && value.capital) {
    country.capital = [value.capital];
  }

  if (isRecord(value.flags)) {
    const flags: CountryFlags = {};
    if (typeof value.flags.png === 'string') flags.png = value.flags.png;
    if (typeof value.flags.svg === 'string') flags.svg = value.flags.svg;
    if (typeof value.flags.alt === 'string') flags.alt = value.flags.alt;
    country.flags = flags;
  }

  return country;
}

export async function fetchCountries(
  signal: AbortSignal,
): Promise<CountriesResponse> {
  const response = await fetch(COUNTRIES_URL, { signal });

  if (!response.ok) {
    throw new Error(`La fuente de países respondió con HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload)) {
    throw new Error('La fuente de países devolvió una respuesta con formato inválido.');
  }

  const countries: Country[] = [];

  for (const item of payload) {
    const country = parseCountry(item);
    if (!country) {
      throw new Error('La fuente de países devolvió un país con datos inválidos.');
    }
    countries.push(country);
  }

  return countries;
}
