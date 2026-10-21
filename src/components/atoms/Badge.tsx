import type { JSX } from 'react';

interface BadgeProps {
  region: string;
}

const regionNames: Record<string, string> = {
  Africa: 'África',
  Americas: 'América',
  Asia: 'Asia',
  Europe: 'Europa',
  Oceania: 'Oceanía',
};

export function Badge({ region }: BadgeProps): JSX.Element {
  return (
    <span className="inline-flex rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      {regionNames[region] ?? region}
    </span>
  );
}