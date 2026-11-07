const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = 'course-images';

/** Allowed types, identified by their file signature rather than the client-supplied MIME type. */
const SIGNATURES: { type: string; ext: string; test: (b: Uint8Array) => boolean }[] = [
  { type: 'image/jpeg', ext: 'jpg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    type: 'image/png',
    ext: 'png',
    test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    type: 'image/webp',
    ext: 'webp',
    test: (b) =>
      String.fromCharCode(b[0], b[1], b[2], b[3]) === 'RIFF' &&
      String.fromCharCode(b[8], b[9], b[10], b[11]) === 'WEBP',
  },
];

export class StorageConfigError extends Error {}
export class UploadValidationError extends Error {}

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/+$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  // A real key is a JWT ("eyJ...") or a new-style secret key ("sb_secret_...").
  const looksReal = Boolean(serviceRoleKey && (serviceRoleKey.startsWith('eyJ') || serviceRoleKey.startsWith('sb_secret_')));
  if (!url || !serviceRoleKey || !looksReal) {
    throw new StorageConfigError(
      'Image storage is not configured on the server. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.'
    );
  }
  return { url, serviceRoleKey };
}

async function ensureBucket(url: string, serviceRoleKey: string) {
  const headers = { Authorization: `Bearer ${serviceRoleKey}`, apikey: serviceRoleKey };
  const res = await fetch(`${url}/storage/v1/bucket/${BUCKET}`, { headers });
  if (res.ok) return;
  if (res.status === 401 || res.status === 403) {
    throw new StorageConfigError('Image storage rejected the server credentials. Check SUPABASE_SERVICE_ROLE_KEY.');
  }
  const create = await fetch(`${url}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: MAX_FILE_SIZE,
      allowed_mime_types: SIGNATURES.map((s) => s.type),
    }),
  });
  if (!create.ok && create.status !== 409) {
    throw new Error(`Failed to create storage bucket (${create.status}): ${await create.text()}`);
  }
}

export interface UploadResult {
  url: string;
  path: string;
}

export type UploadFolder = 'courses' | 'students';
export const UPLOAD_FOLDERS: readonly UploadFolder[] = ['courses', 'students'];

export async function uploadImage(file: File, folder: UploadFolder): Promise<UploadResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadValidationError('Image must be smaller than 5 MB.');
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = SIGNATURES.find((s) => s.test(buffer));
  if (!kind) {
    throw new UploadValidationError('Only JPG, PNG and WebP images are allowed.');
  }

  const { url, serviceRoleKey } = getSupabaseConfig();
  await ensureBucket(url, serviceRoleKey);

  const path = `${folder}/${crypto.randomUUID()}.${kind.ext}`;
  const uploadRes = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      'Content-Type': kind.type,
    },
    body: buffer,
  });

  if (uploadRes.status === 401 || uploadRes.status === 403) {
    throw new StorageConfigError('Image storage rejected the server credentials. Check SUPABASE_SERVICE_ROLE_KEY.');
  }
  if (!uploadRes.ok) {
    throw new Error(`Upload failed (${uploadRes.status}): ${await uploadRes.text()}`);
  }

  return { url: `${url}/storage/v1/object/public/${BUCKET}/${path}`, path };
}

export async function deleteImage(path: string) {
  if (!/^(courses|students)\/[A-Za-z0-9-]+\.(jpg|png|webp)$/.test(path)) return;
  try {
    const { url, serviceRoleKey } = getSupabaseConfig();
    await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${serviceRoleKey}`, apikey: serviceRoleKey },
    });
  } catch (error) {
    console.warn('Could not delete old image:', error);
  }
}
