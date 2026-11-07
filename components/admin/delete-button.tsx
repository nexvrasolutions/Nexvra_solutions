'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteButton({
  endpoint,
  label,
  confirmText,
  redirectTo,
  className,
}: {
  endpoint: string;
  label: string;
  confirmText: string;
  /** Where to go after deleting; when omitted the current page is refreshed. */
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Delete failed.');
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={
          className ??
          'rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60'
        }
      >
        {busy ? 'Deleting...' : label}
      </button>
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
