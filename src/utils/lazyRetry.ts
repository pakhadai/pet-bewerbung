/**
 * Lazy load with retry on chunk load failure (404 after deploy).
 * On first failure, force-reloads the page so browser fetches new assets.
 *
 * FIX: Clear FORCE_REFRESH_KEY when throwing so ErrorBoundary "Try Again" has clean state.
 * Otherwise sessionStorage stays 'true' and retries never get a fresh attempt.
 * Only reload on ChunkLoadError (typical 404 after deploy), not on firewall/network errors.
 */
import { lazy } from 'react';

const FORCE_REFRESH_KEY = 'page-force-refreshed';

function isChunkLoadError(error: unknown): boolean {
  const msg = String(error instanceof Error ? error.message : error);
  return (
    msg.includes('ChunkLoadError') ||
    msg.includes('Loading chunk') ||
    msg.includes('Loading CSS chunk') ||
    msg.includes('Failed to fetch dynamically imported module') ||
    (msg.includes('404') && msg.includes('chunk'))
  );
}

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
        sessionStorage.removeItem(FORCE_REFRESH_KEY);
      }
      return component;
    } catch (error) {
      if (!alreadyRefreshed && typeof window !== 'undefined' && isChunkLoadError(error)) {
        sessionStorage.setItem(FORCE_REFRESH_KEY, 'true');
        window.location.reload();
        return Promise.reject(new Error('Reloading page to fetch new chunks...'));
      }
      // Clear flag only when throwing due to non-ChunkLoadError (firewall, etc).
      // Keeps flag when ChunkLoadError after reload - prevents infinite reload on Try Again.
      if (typeof sessionStorage !== 'undefined' && !isChunkLoadError(error)) {
        sessionStorage.removeItem(FORCE_REFRESH_KEY);
      }
      throw error;
    }
  });
};
