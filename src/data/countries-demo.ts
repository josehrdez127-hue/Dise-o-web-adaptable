import type { Country } from '../types/country';

export const paisUno: Country = {
  name: { common: 'Canadá' },
  cca2: 'CA',
  cca3: 'CAN',
  flags: {
    png: 'https://flagcdn.com/w640/ca.png',
    alt: 'Bandera de Canadá',
  },
  population: 38005238,
  region: 'Americas',
  capital: ['Ottawa'],
};

export const paisDos: Country = {
  name: { common: 'Japón' },
  cca2: 'JP',
  cca3: 'JPN',
  flags: {
    png: 'https://flagcdn.com/w640/jp.png',
    alt: 'Bandera de Japón',
  },
  population: 125836021,
  region: 'Asia',
  capital: ['Tokio'],
};

export const paisTres: Country = {
  name: { common: 'Italia' },
  cca2: 'IT',
  cca3: 'ITA',
  flags: {
    png: 'https://flagcdn.com/w640/it.png',
    alt: 'Bandera de Italia',
  },
  population: 58870762,
  region: 'Europe',
  capital: ['Roma'],
};
