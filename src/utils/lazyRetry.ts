/**
 * Lazy load with retry on chunk load failure (404 after deploy).
 * On first failure, force-reloads the page so browser fetches new assets.
 */
import { lazy } from 'react';

const FORCE_REFRESH_KEY = 'page-force-refreshed';

export const lazyRetry = <T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) => {
  return lazy(async () => {
    const alreadyRefreshed = JSON.parse(
      typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(FORCE_REFRESH_KEY) || 'false' : 'false'
    );
    try {
      const component = await componentImport();
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(FORCE_REFRESH_KEY, 'false');
      }
      return component;
    } catch (error) {
      if (!alreadyRefreshed && typeof window !== 'undefined') {
        sessionStorage.setItem(FORCE_REFRESH_KEY, 'true');
        window.location.reload();
        return new Promise(() => {}); // Never resolves - page is reloading
      }
      throw error;
    }
  });
};
