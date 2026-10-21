import type { JSX, ReactNode } from 'react';

interface HeaderProps {
  children: ReactNode;
}

export function Header({ children }: HeaderProps): JSX.Element {
  return (
    <header className="mb-9 border-b border-slate-300 pb-7 dark:border-slate-700">
      {children}
    </header>
  );
}