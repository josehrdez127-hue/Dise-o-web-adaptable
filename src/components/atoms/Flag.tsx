import type { JSX } from 'react';

interface FlagProps {
  src: string;
  alt: string;
}

export function Flag({ src, alt }: FlagProps): JSX.Element {
  return (
    <img
      src={src}
      alt={alt}
      className="h-48 w-full bg-slate-50 object-contain dark:bg-slate-800"
      loading="lazy"
    />
  );
}