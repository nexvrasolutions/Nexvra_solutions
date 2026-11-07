import QRCode from 'qrcode';

const QR_OPTIONS = {
  width: 512,
  margin: 1,
  errorCorrectionLevel: 'M' as const,
  color: { dark: '#0a0a0a', light: '#ffffff' },
};

function appBaseUrl() {
  // Vercel Preview deployments live at their own URL; QR codes made there must
  // point back at that preview rather than at the production site.
  const previewHost = process.env.VERCEL_ENV === 'preview' ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL : '';
  const base = previewHost ? `https://${previewHost}` : process.env.APP_URL?.trim();
  if (!base) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('APP_URL must be set in production so QR codes point at the public site.');
    }
    return 'http://localhost:3000';
  }
  return base.replace(/\/+$/, '');
}

/** Public URL a student's QR code points to. */
export function buildStudentProfileUrl(token: string) {
  return `${appBaseUrl()}/verify/${token}`;
}

/**
 * QR codes are generated on demand instead of being written to /public:
 * the encoded URL always follows the current APP_URL, and it works on
 * read-only/serverless file systems.
 */
export async function generateStudentQrBuffer(token: string) {
  return QRCode.toBuffer(buildStudentProfileUrl(token), { ...QR_OPTIONS, type: 'png' });
}

export async function generateStudentQrDataUrl(token: string) {
  return QRCode.toDataURL(buildStudentProfileUrl(token), QR_OPTIONS);
}
