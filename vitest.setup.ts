import { vi } from 'vitest';

/**
 * jsdom does not implement canvas.toDataURL; imageCompression runs supportsWebP()
 * at module load. Stub so imports don't stderr and tests stay deterministic.
 */
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/jpeg;base64,') as unknown as typeof HTMLCanvasElement.prototype.toDataURL;
}
