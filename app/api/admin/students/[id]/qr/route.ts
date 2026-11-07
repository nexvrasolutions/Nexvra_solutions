import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError, requireAdmin, unauthorized } from '@/lib/api';
import { generateStudentQrBuffer } from '@/lib/qr';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    select: { fullName: true, studentCode: true, profileToken: true },
  });
  if (!student) return jsonError('Student not found.', 404);

  const buffer = await generateStudentQrBuffer(student.profileToken);
  const isDownload = new URL(request.url).searchParams.get('download') === '1';
  const safeName =
    `${student.fullName}-${student.studentCode}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'student';

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': isDownload ? `attachment; filename="${safeName}-qr.png"` : 'inline',
      'Cache-Control': 'private, no-store',
    },
  });
}
