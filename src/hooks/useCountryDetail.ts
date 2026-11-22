import { useEffect, useState } from 'react';
import { fetchCountryByCode } from '../services/countries';
import type { CountryDetail } from '../types/country-detail';

export interface UseCountryDetailResult {
  countryDetail: CountryDetail | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

interface CountryDetailState {
  code: string;
  attempt: number;
  countryDetail: CountryDetail | null;
  isLoading: boolean;
  error: string | null;
}

export function useCountryDetail(
  code: string | undefined,
): UseCountryDetailResult {
  const [retryCount, setRetryCount] = useState(0);
  const [state, setState] = useState<CountryDetailState>({
    code: '',
    attempt: 0,
    countryDetail: null,
    isLoading: true,
    error: null,
  });
  const normalizedCode = code?.trim().toUpperCase() ?? '';

  useEffect(() => {
    if (!normalizedCode) return;

    const controller = new AbortController();

    async function loadCountry(): Promise<void> {
      try {
        const result = await fetchCountryByCode(
          normalizedCode,
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setState({
            code: normalizedCode,
            attempt: retryCount,
            countryDetail: result,
            isLoading: false,
            error: null,
          });
        }
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setState({
            code: normalizedCode,
            attempt: retryCount,
            countryDetail: null,
            isLoading: false,
            error:
              loadError instanceof Error
                ? loadError.message
                : 'Ocurrió un error inesperado al cargar el país.',
          });
        }
      }
    }

    void loadCountry();

    return () => controller.abort();
  }, [normalizedCode, retryCount]);

  function retry(): void {
    setRetryCount((count) => count + 1);
  }

  const stateMatchesRequest =
    state.code === normalizedCode && state.attempt === retryCount;
  const countryDetail = stateMatchesRequest ? state.countryDetail : null;
  const isLoading =
    normalizedCode !== '' &&
    (!stateMatchesRequest || state.isLoading);
  const error = normalizedCode
    ? stateMatchesRequest
      ? state.error
      : null
    : 'No se recibió el código del país.';

  return {
    countryDetail,
    isLoading,
    error,
    retry,
  };
}
