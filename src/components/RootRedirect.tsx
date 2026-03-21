import React from 'react';
import { Navigate } from 'react-router-dom';
import { SUPPORTED_LANGS, type Language } from '../hooks/useTranslation';

/**
 * `/` → `/{lang}/` using browser language when supported, else German (SEO default).
 */
const RootRedirect: React.FC = () => {
  let code: Language = 'de';
  try {
    const nav = (navigator?.language ?? 'de').slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(nav as Language)) code = nav as Language;
  } catch {
    /* ignore */
  }
  return <Navigate to={`/${code}/`} replace />;
};

export default RootRedirect;
