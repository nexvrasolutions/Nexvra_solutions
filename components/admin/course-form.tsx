'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type CourseFormValues = {
  code: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  syllabus: string;
  technologies: string;
  skills: string;
  projects: string;
  level: string;
  image: string;
  isActive: boolean;
};

export function CourseForm({
  mode = 'create',
  initialData,
}: {
  mode?: 'create' | 'edit';
  initialData?: Partial<CourseFormValues> & { id?: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CourseFormValues>({
    code: initialData?.code || '',
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
    syllabus: initialData?.syllabus || '',
    technologies: initialData?.technologies || '',
    skills: initialData?.skills || '',
    projects: initialData?.projects || '',
    level: initialData?.level || 'Beginner',
    image: initialData?.image || '/images/courses/front_end.webp',
    isActive: initialData?.isActive ?? true,
  });

  const updateField = (field: keyof CourseFormValues, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(
        mode === 'edit' && initialData?.id ? `/api/admin/courses/${initialData.id}` : '/api/admin/courses',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to save course.');
      }

      router.push('/admin/courses');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save course.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Course Code</label>
          <input
            value={form.code}
            onChange={(e) => updateField('code', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Course Name</label>
          <input
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Duration</label>
          <input
            value={form.duration}
            onChange={(e) => updateField('duration', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Level</label>
          <input
            value={form.level}
            onChange={(e) => updateField('level', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Image Path</label>
          <input
            value={form.image}
            onChange={(e) => updateField('image', e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="min-h-[80px] w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Syllabus</label>
        <textarea
          value={form.syllabus}
          onChange={(e) => updateField('syllabus', e.target.value)}
          className="min-h-[80px] w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">Technologies</label>
          <textarea
            value={form.technologies}
            onChange={(e) => updateField('technologies', e.target.value)}
            className="min-h-[90px] w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Skills</label>
          <textarea
            value={form.skills}
            onChange={(e) => updateField('skills', e.target.value)}
            className="min-h-[90px] w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Projects</label>
          <textarea
            value={form.projects}
            onChange={(e) => updateField('projects', e.target.value)}
            className="min-h-[90px] w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]"
          />
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => updateField('isActive', e.target.checked)}
        />
        <span className="text-sm font-medium">Course is active</span>
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
          {submitting ? 'Saving...' : mode === 'edit' ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}
