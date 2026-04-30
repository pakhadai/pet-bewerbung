import { describe, expect, it } from 'vitest'
import { buildPublicFileUrl } from '../publicAssetUrl'

describe('buildPublicFileUrl', () => {
  it('resolves logo at site root when BASE_URL is /', () => {
    expect(buildPublicFileUrl('https://example.com', '/', '/logo.webp')).toBe(
      'https://example.com/logo.webp'
    )
  })

  it('includes subpath when BASE_URL is /app/', () => {
    expect(buildPublicFileUrl('https://example.com', '/app/', '/logo.webp')).toBe(
      'https://example.com/app/logo.webp'
    )
  })

  it('normalizes BASE_URL without trailing slash', () => {
    expect(buildPublicFileUrl('https://example.com', '/app', '/logo.webp')).toBe(
      'https://example.com/app/logo.webp'
    )
  })

  it('strips leading slash from public path', () => {
    expect(buildPublicFileUrl('https://x.test', '/', 'logo.webp')).toBe('https://x.test/logo.webp')
  })
})
