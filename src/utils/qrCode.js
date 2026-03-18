/**
 * QR code generation for PDF (mailto or vCard)
 * Uses qrcode package - generates data URL for embedding in react-pdf Image
 */
import QRCode from 'qrcode';

/**
 * Build vCard 3.0 string for owner contact
 * @param {Object} data - Form data with ownerName, email, phone, street, houseNumber, postal, city
 * @returns {string} vCard string
 */
export function buildVCard(data) {
  const name = (data?.ownerName || '').trim();
  const email = (data?.email || '').trim();
  const phone = (data?.phone || '').trim();
  const street = [data?.street, data?.houseNumber].filter(Boolean).join(' ');
  const city = data?.city || '';
  const postal = data?.postal || '';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    name ? `FN:${escapeVCard(name)}` : null,
    name ? `N:${escapeVCard(name)};;;` : null,
    email ? `EMAIL:${escapeVCard(email)}` : null,
    phone ? `TEL:${escapeVCard(phone.replace(/\s/g, ''))}` : null,
    street || city || postal
      ? `ADR:;;${escapeVCard(street)};${escapeVCard(city)};;${escapeVCard(postal)};CH`
      : null,
    'END:VCARD',
  ].filter(Boolean);

  return lines.join('\r\n');
}

function escapeVCard(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/[;,]/g, '\\$&')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Build mailto: URL for owner
 * @param {Object} data - Form data with email
 * @returns {string} mailto URL or null
 */
export function buildMailto(data) {
  const email = (data?.email || '').trim();
  if (!email) return null;
  return `mailto:${email}`;
}

/**
 * Generate QR code as data URL (PNG)
 * @param {string} content - Content to encode (mailto, vCard, URL)
 * @param {Object} options - { size: number (pixels), margin: number }
 * @returns {Promise<string>} data URL
 */
export async function generateQrDataUrl(content, options = {}) {
  const { size = 120, margin = 2 } = options;
  if (!content || content.length < 2) return null;
  try {
    return await QRCode.toDataURL(content, {
      width: size,
      margin,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.warn('QR generation failed:', err);
    return null;
  }
}

/**
 * Get best QR content: vCard (full contact) or mailto (email only)
 * @param {Object} data - Form data
 * @returns {string|null}
 */
export function getQrContent(data) {
  const hasContact = data?.ownerName || data?.email || data?.phone;
  if (!hasContact) return null;
  const vcard = buildVCard(data);
  return vcard;
}
