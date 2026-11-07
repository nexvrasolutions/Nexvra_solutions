import { permanentRedirect } from 'next/navigation';

/**
 * Legacy duplicate of the public student page. QR codes and the admin
 * "View public" link use /verify/<token>; keep old links working.
 */
export default async function LegacyStudentProfilePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  permanentRedirect(`/verify/${encodeURIComponent(token)}`);
}
