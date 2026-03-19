// Umami analytics helper (privacy-friendly: no consent UI in this app).
// If Umami is not configured (no website id), everything becomes a no-op.

export type UmamiTrackData = Record<string, unknown>;

declare global {
  interface Window {
    umami?: {
      track?: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}

let umamiInitStarted = false;

function getEnvString(name: string): string | undefined {
  const val = Reflect.get(import.meta.env, name);
  return typeof val === 'string' && val.trim() ? val : undefined;
}

export function initUmami(): void {
  if (umamiInitStarted) return;
  umamiInitStarted = true;

  const websiteId = getEnvString('VITE_UMAMI_WEBSITE_ID');
  if (!websiteId) return; // Not configured.

  const host = getEnvString('VITE_UMAMI_HOST') ?? 'https://analytics.umami.is';
  const domain = getEnvString('VITE_UMAMI_DOMAINS') ?? window.location.hostname;

  // Prevent duplicate script injection (dev StrictMode can run effects twice).
  const existing = document.querySelector<HTMLScriptElement>('script[data-umami="true"]');
  if (existing) return;

  const normalizedHost = host.replace(/\/+$/, '');
  const scriptSrc = normalizedHost.includes('script.js') ? normalizedHost : `${normalizedHost}/script.js`;

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = scriptSrc;
  script.dataset.umami = 'true';
  script.dataset.websiteId = websiteId;
  script.dataset.domains = domain;
  // Keep the default behavior for automatic page view tracking.
  document.head.appendChild(script);
}

export function trackUmamiEvent(eventName: string, data?: UmamiTrackData): void {
  try {
    window.umami?.track?.(eventName, data);
  } catch {
    // Never break the app if analytics fails.
  }
}

