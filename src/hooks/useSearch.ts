import { useState } from 'react';
import type { RegionFilterValue } from '../components/molecules/RegionFilter';
import type { Country } from '../types/country';

export interface UseSearchResult {
  query: string;
  region: RegionFilterValue;
  filteredCountries: Country[];
  onQueryChange: (query: string) => void;
  onRegionChange: (region: RegionFilterValue) => void;
}

export function useSearch(countries: Country[]): UseSearchResult {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<RegionFilterValue>('all');

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredCountries = countries.filter((country) => {
    const matchesQuery = country.name.common
      .toLocaleLowerCase()
      .includes(normalizedQuery);
    const matchesRegion = region === 'all' || country.region === region;

    return matchesQuery && matchesRegion;
  });

  return {
    query,
    region,
    filteredCountries,
    onQueryChange: setQuery,
    onRegionChange: setRegion,
  };
}
