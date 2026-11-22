import type { Country } from './country';

export interface CountryBorder {
  code: string;
  routeCode: string;
  name: string;
}

export interface CountryDetail extends Country {
  borderCountries: CountryBorder[];
}
