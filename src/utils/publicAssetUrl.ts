/**
 * Resolve absolute URL for a file in Vite `public/` folder.
 * Uses Vite BASE_URL so deployment under subpaths (e.g. GitHub Pages) works.
 */
export function buildPublicFileUrl(
  origin: string,
  viteBase: string,
  publicPathFromRoot: string
): string {
  const rel = publicPathFromRoot.replace(/^\//, '');
  const base =
    !viteBase || viteBase === '/'
      ? '/'
      : viteBase.endsWith('/')
        ? viteBase
        : `${viteBase}/`;
  const baseUrl = `${origin}${base}`;
  return new URL(rel, baseUrl).href;
}
