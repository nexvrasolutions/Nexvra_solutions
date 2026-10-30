import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveAdminFromCookies } from '@/lib/auth';
import { getQrBuffer } from '@/lib/qr';

async function requireAdmin() {
  return getActiveAdminFromCookies();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });

  if (!student) {
    return NextResponse.json({ message: 'Student not found.' }, { status: 404 });
  }

  const buffer = await getQrBuffer(student.profileToken);
  const isDownload = new URL(request.url).searchParams.get('download') === '1';

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': isDownload
        ? `attachment; filename="${student.fullName.replace(/\s+/g, '-').toLowerCase()}-qr.png"`
        : 'inline',
      'Cache-Control': 'no-store',
    },
  });
}
