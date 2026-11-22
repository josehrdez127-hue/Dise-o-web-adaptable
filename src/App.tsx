import type { JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CountryDetailPage } from './pages/CountryDetailPage';
import { HomePage } from './pages/HomePage';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/country/:code" element={<CountryDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
