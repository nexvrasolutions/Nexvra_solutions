import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export function buildStudentProfileUrl(token: string) {
  const base = process.env.APP_URL || 'http://localhost:3000';
  return `${base}/students/${token}`;
}

export async function ensureStudentQrFile(token: string) {
  const publicDir = path.join(process.cwd(), 'public', 'qr', 'students');
  const filePath = path.join(publicDir, `${token}.png`);

  await fs.mkdir(publicDir, { recursive: true });

  try {
    await fs.access(filePath);
    return `/qr/students/${token}.png`;
  } catch {
    const qrDataUrl = await QRCode.toDataURL(buildStudentProfileUrl(token), {
      width: 512,
      margin: 1,
      color: {
        dark: '#0a0a0a',
        light: '#ffffff',
      },
    });

    const base64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    await fs.writeFile(filePath, Buffer.from(base64, 'base64'));
    return `/qr/students/${token}.png`;
  }
}

export async function getQrBuffer(token: string) {
  const publicDir = path.join(process.cwd(), 'public', 'qr', 'students');
  const filePath = path.join(publicDir, `${token}.png`);

  try {
    const file = await fs.readFile(filePath);
    return file;
  } catch {
    await ensureStudentQrFile(token);
    return fs.readFile(filePath);
  }
}

export async function generateStudentQrPng(token: string) {
  const qrPath = await ensureStudentQrFile(token);
  return qrPath;
}

export function normalizeStudentData(value: string | null | undefined) {
  return value?.trim() || '';
}

export const storageBaseUrl = isProduction ? process.env.APP_URL : 'http://localhost:3000';
