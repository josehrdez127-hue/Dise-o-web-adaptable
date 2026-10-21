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
    <span className="font-medium text-slate-600">
      {regionNames[region] ?? region}
    </span>
  );
}