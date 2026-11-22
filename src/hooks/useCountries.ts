import { useEffect, useState } from 'react';
import { fetchCountries } from '../services/countries';
import type { Country } from '../types/country';

export interface UseCountriesResult {
  countries: Country[];
  isLoading: boolean;
  error: string | null;
}

export function useCountries(): UseCountriesResult {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries(): Promise<void> {
      try {
        const result = await fetchCountries(controller.signal);
        setCountries(result);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Ocurrió un error inesperado al cargar los países.',
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadCountries();

    return () => controller.abort();
  }, []);

  return { countries, isLoading, error };
}
