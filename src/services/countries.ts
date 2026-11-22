import type { Country, CountriesResponse, CountryFlags } from '../types/country';

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
