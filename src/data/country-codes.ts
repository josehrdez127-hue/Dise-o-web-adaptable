import type { Country } from '../types/country';
import type { CountryBorder } from '../types/country-detail';

export function mapCountryBorders(
  borderCodes: string[] | undefined,
  countries: readonly Country[],
): CountryBorder[] {
  const countriesByAlpha3 = new Map<string, Country>();

  for (const country of countries) {
    if (country.cca3) countriesByAlpha3.set(country.cca3, country);
  }

  return (borderCodes ?? []).map((code) => {
    const borderingCountry = countriesByAlpha3.get(code);

    return {
      code,
      routeCode: borderingCountry?.cca2 ?? code,
      name: borderingCountry?.name.common ?? code,
    };
  });
}
