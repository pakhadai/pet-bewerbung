// Umami analytics helper (privacy-friendly: no consent UI in this app).
// Script loads after idle — avoids competing with first paint / main bundle (Lighthouse).
// Override with VITE_UMAMI_WEBSITE_ID / VITE_UMAMI_HOST in .env

export type UmamiTrackData = Record<string, unknown>;

declare global {
  interface Window {
    umami?: {
      track?: (eventName: string, data?: Record<string, unknown>) => void;
    };
  }
}

let umamiInitStarted = false;

/** Same default as former index.html embed; override via VITE_UMAMI_* in .env */
const DEFAULT_WEBSITE_ID = 'a0c4edd1-3953-4ba8-9f16-4afb1a067805';
const DEFAULT_HOST = 'https://cloud.umami.is';

function getEnvString(name: string): string | undefined {
  const val = Reflect.get(import.meta.env, name);
  return typeof val === 'string' && val.trim() ? val : undefined;
}

function injectUmamiScript(websiteId: string, host: string, domain: string): void {
  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-umami="true"], script[src*="umami"][data-website-id]'
  );
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
  document.head.appendChild(script);
}

export function initUmami(): void {
  if (umamiInitStarted) return;
  umamiInitStarted = true;

  const websiteId = getEnvString('VITE_UMAMI_WEBSITE_ID') ?? DEFAULT_WEBSITE_ID;
  const host = getEnvString('VITE_UMAMI_HOST') ?? DEFAULT_HOST;
  const domain = getEnvString('VITE_UMAMI_DOMAINS') ?? window.location.hostname;

  const run = () => injectUmamiScript(websiteId, host, domain);

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 3000 });
  } else {
    window.setTimeout(run, 0);
  }
}

export function trackUmamiEvent(eventName: string, data?: UmamiTrackData): void {
  try {
    window.umami?.track?.(eventName, data);
  } catch {
    // Never break the app if analytics fails.
  }
}
