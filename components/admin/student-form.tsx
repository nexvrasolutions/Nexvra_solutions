'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type StudentFormValues = {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  department: string;
  batch: string;
  publicProfileEnabled: boolean;
};

export function StudentForm({
  mode = 'create',
  initialData,
}: {
  mode?: 'create' | 'edit';
  initialData?: Partial<StudentFormValues> & { id?: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<StudentFormValues>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    institution: initialData?.institution || '',
    department: initialData?.department || '',
    batch: initialData?.batch || '',
    publicProfileEnabled: initialData?.publicProfileEnabled ?? true,
  });

  const updateField = (field: keyof StudentFormValues, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(
        mode === 'edit' && initialData?.id ? `/api/admin/students/${initialData.id}` : '/api/admin/students',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to save student.');
      }

      router.push('/admin/students');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Full Name</label>
          <input
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Institution</label>
          <input
            value={form.institution}
            onChange={(e) => updateField('institution', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Department</label>
          <input
            value={form.department}
            onChange={(e) => updateField('department', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Batch</label>
          <input
            value={form.batch}
            onChange={(e) => updateField('batch', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.publicProfileEnabled}
          onChange={(e) => updateField('publicProfileEnabled', e.target.checked)}
        />
        <span className="text-sm font-medium">Enable public student profile</span>
      </label>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[#0a0a0a] px-5 py-2.5 font-medium text-white transition hover:bg-black disabled:opacity-60"
        >
          {submitting ? 'Saving...' : mode === 'edit' ? 'Update Student' : 'Create Student'}
        </button>
      </div>
    </form>
  );
}
