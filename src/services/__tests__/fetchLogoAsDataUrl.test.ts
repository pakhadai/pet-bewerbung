import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('fetchLogoAsDataUrl', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('BASE_URL', '/');
    vi.stubGlobal(
      'window',
      Object.assign(globalThis.window, {
        location: { origin: 'https://example.com' },
      }) as Window & typeof globalThis
    );
  });

  afterEach(() => {
    vi.stubGlobal('fetch', originalFetch);
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns a JPEG data URL when server returns image/jpeg', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => new Blob([new Uint8Array([0xff, 0xd8, 0xff])], { type: 'image/jpeg' }),
      })
    );

    const { fetchLogoAsDataUrl } = await import('../pdfService');
    const result = await fetchLogoAsDataUrl();

    expect(result).toBeTruthy();
    expect(result!.startsWith('data:image/jpeg')).toBe(true);
    expect(fetch).toHaveBeenCalledWith('https://example.com/logo.webp');
  });

  it('returns null when response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        blob: async () => new Blob(),
      })
    );

    const { fetchLogoAsDataUrl } = await import('../pdfService');
    const result = await fetchLogoAsDataUrl();
    expect(result).toBeNull();
  });

  it('requests logo under BASE_URL subpath', async () => {
    vi.stubEnv('BASE_URL', '/pet-app/');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => new Blob([1, 2, 3], { type: 'image/jpeg' }),
      })
    );

    const { fetchLogoAsDataUrl } = await import('../pdfService');
    await fetchLogoAsDataUrl();

    expect(fetch).toHaveBeenCalledWith('https://example.com/pet-app/logo.webp');
  });
});
