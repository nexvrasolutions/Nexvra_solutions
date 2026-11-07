import { NextResponse } from 'next/server';
import { jsonError, requireAdmin, unauthorized } from '@/lib/api';
import {
  StorageConfigError,
  UPLOAD_FOLDERS,
  UploadValidationError,
  uploadImage,
  type UploadFolder,
} from '@/lib/storage/upload';

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  let file: FormDataEntryValue | null;
  let folder: UploadFolder = 'courses';
  try {
    const form = await request.formData();
    file = form.get('file');
    const requested = form.get('folder');
    if (typeof requested === 'string' && requested) {
      if (!UPLOAD_FOLDERS.includes(requested as UploadFolder)) {
        return jsonError('Unknown upload folder.', 400);
      }
      folder = requested as UploadFolder;
    }
  } catch {
    return jsonError('Send the image as multipart form data in a "file" field.', 400);
  }
  if (!file || !(file instanceof File) || file.size === 0) {
    return jsonError('No file provided.', 400);
  }

  try {
    // Only known folders are accepted; old images are removed when the record is saved.
    const result = await uploadImage(file, folder);
    return NextResponse.json({ url: result.url, path: result.path });
  } catch (error) {
    if (error instanceof UploadValidationError) return jsonError(error.message, 400);
    if (error instanceof StorageConfigError) return jsonError(error.message, 503);
    console.error('Image upload failed:', error);
    return jsonError('Image upload failed. Please try again.', 502);
  }
}
