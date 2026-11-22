import type { Country, CountriesResponse, CountryFlags } from '../types/country';
import { mapCountryBorders } from '../data/country-codes';
import type { CountryDetail } from '../types/country-detail';

const COUNTRIES_URL =
  'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';
const POPULATION_URL =
  'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=1000&date=2023:2024';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function parseCurrencies(value: unknown): Country['currencies'] {
  if (!isRecord(value)) return undefined;

  const currencies: NonNullable<Country['currencies']> = {};
  for (const [code, currency] of Object.entries(value)) {
    if (!isRecord(currency) || typeof currency.name !== 'string') continue;

    currencies[code] = {
      name: currency.name,
      ...(typeof currency.symbol === 'string' && { symbol: currency.symbol }),
    };
  }

  return Object.keys(currencies).length > 0 ? currencies : undefined;
}

function parseLanguages(value: unknown): Country['languages'] {
  if (!isRecord(value)) return undefined;

  const languages = Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  );

  return Object.keys(languages).length > 0 ? languages : undefined;
}

function parsePopulationMap(payload: unknown): Map<string, number> {
  if (!Array.isArray(payload) || !Array.isArray(payload[1])) {
    throw new Error('La fuente de población devolvió una respuesta con formato inválido.');
  }

  const populations = new Map<string, { year: number; value: number }>();

  for (const record of payload[1]) {
    if (
      !isRecord(record) ||
      typeof record.countryiso3code !== 'string' ||
      typeof record.date !== 'string' ||
      (record.value !== null && typeof record.value !== 'number')
    ) {
      throw new Error('La fuente de población devolvió datos inválidos.');
    }

    if (record.value === null) continue;

    const year = Number(record.date);
    const current = populations.get(record.countryiso3code);
    if (!current || year > current.year) {
      populations.set(record.countryiso3code, {
        year,
        value: record.value,
      });
    }
  }

  return new Map(
    Array.from(populations, ([code, population]) => [code, population.value]),
  );
}

function parseCountry(
  value: unknown,
  populations: ReadonlyMap<string, number>,
): Country | null {
  if (
    !isRecord(value) ||
    !isRecord(value.name) ||
    typeof value.name.common !== 'string' ||
    typeof value.region !== 'string'
  ) {
    return null;
  }

  const commonName =
    isRecord(value.translations) &&
    isRecord(value.translations.spa) &&
    typeof value.translations.spa.common === 'string'
      ? value.translations.spa.common
      : value.name.common;
  const country: Country = {
    name: { common: commonName },
    region: value.region,
  };

  if (typeof value.name.official === 'string') {
    country.name.official = value.name.official;
  }
  if (typeof value.cca2 === 'string') {
    country.cca2 = value.cca2;
    country.flags = {
      png: `https://flagcdn.com/w640/${value.cca2.toLowerCase()}.png`,
      alt: `Bandera de ${commonName}`,
    };
  }
  if (typeof value.cca3 === 'string') {
    country.cca3 = value.cca3;
    country.population = populations.get(value.cca3);
  }
  if (typeof value.subregion === 'string') country.subregion = value.subregion;
  if (isStringArray(value.capital)) country.capital = value.capital;
  if (isStringArray(value.tld)) country.tld = value.tld;
  if (isStringArray(value.borders)) country.borders = value.borders;

  const currencies = parseCurrencies(value.currencies);
  if (currencies) country.currencies = currencies;

  const languages = parseLanguages(value.languages);
  if (languages) country.languages = languages;

  if (isRecord(value.flags)) {
    const flags: CountryFlags = country.flags ?? {};
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
  const [countriesResponse, populationResponse] = await Promise.all([
    fetch(COUNTRIES_URL, { signal }),
    fetch(POPULATION_URL, { signal }),
  ]);

  if (!countriesResponse.ok) {
    throw new Error(
      `La fuente de países respondió con HTTP ${countriesResponse.status}.`,
    );
  }
  if (!populationResponse.ok) {
    throw new Error(
      `La fuente de población respondió con HTTP ${populationResponse.status}.`,
    );
  }

  const [countriesPayload, populationPayload]: [unknown, unknown] =
    await Promise.all([countriesResponse.json(), populationResponse.json()]);

  if (!Array.isArray(countriesPayload)) {
    throw new Error('La fuente de países devolvió una respuesta con formato inválido.');
  }

  const populations = parsePopulationMap(populationPayload);
  const countries: Country[] = [];

  for (const item of countriesPayload) {
    const country = parseCountry(item, populations);
    if (!country) {
      throw new Error('La fuente de países devolvió un país con datos inválidos.');
    }
    countries.push(country);
  }

  return countries;
}

export async function fetchCountryByCode(
  code: string,
  signal: AbortSignal,
): Promise<CountryDetail> {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) {
    throw new Error('El código del país está vacío.');
  }

  const countries = await fetchCountries(signal);
  const country = countries.find(
    (item) =>
      item.cca2?.toUpperCase() === normalizedCode ||
      item.cca3?.toUpperCase() === normalizedCode,
  );

  if (!country) {
    throw new Error(`No se encontró un país con el código ${normalizedCode}.`);
  }

  return {
    ...country,
    borderCountries: mapCountryBorders(country.borders, countries),
  };
}
