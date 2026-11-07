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

const DEFAULT_IMAGE = '/images/courses/front_end.webp';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

const inputClass =
  'w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00]';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function Field({
  id,
  label,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-black/50">{hint}</p> : null}
    </div>
  );
}

export function CourseForm({
  mode = 'create',
  initialData,
}: {
  mode?: 'create' | 'edit';
  initialData?: Partial<CourseFormValues> & { id?: string };
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData?.slug));
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
    image: initialData?.image || DEFAULT_IMAGE,
    isActive: initialData?.isActive ?? true,
  });

  const updateField = <K extends keyof CourseFormValues>(field: K, value: CourseFormValues[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleNameChange = (value: string) => {
    setForm((current) => ({ ...current, name: value, slug: slugTouched ? current.slug : slugify(value) }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    setError('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG and WebP images are allowed.');
      input.value = '';
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Image must be smaller than 5 MB.');
      input.value = '';
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed.');
      }
      // The previous image is only removed on the server once the course is saved.
      updateField('image', data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
      input.value = '';
    } finally {
      setUploading(false);
    }
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

      const data = await response.json().catch(() => ({}));
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

  const hasCustomImage = form.image !== DEFAULT_IMAGE;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="course-code" label="Course Code">
          <input
            id="course-code"
            value={form.code}
            onChange={(e) => updateField('code', e.target.value)}
            maxLength={40}
            className={inputClass}
            required
          />
        </Field>

        <Field id="course-name" label="Course Name">
          <input
            id="course-name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            maxLength={160}
            className={inputClass}
            required
          />
        </Field>

        <Field id="course-slug" label="Slug" hint="Lowercase letters, numbers and hyphens. Filled from the name.">
          <input
            id="course-slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              updateField('slug', e.target.value.toLowerCase());
            }}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className={inputClass}
            required
          />
        </Field>

        <Field id="course-duration" label="Duration">
          <input
            id="course-duration"
            value={form.duration}
            onChange={(e) => updateField('duration', e.target.value)}
            placeholder="e.g. 6 weeks"
            className={inputClass}
          />
        </Field>

        <Field id="course-level" label="Level">
          <input
            id="course-level"
            value={form.level}
            onChange={(e) => updateField('level', e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field id="course-image" label="Course Image" hint="JPG, PNG or WebP, up to 5 MB." className="md:col-span-2">
          <div className="flex flex-col gap-3">
            <input
              id="course-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={uploading}
              className={inputClass}
            />
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- remote storage URL */}
              <img
                src={form.image}
                alt={hasCustomImage ? 'Course image preview' : 'Default course image'}
                className="h-32 w-32 rounded-lg border border-black/10 object-cover"
              />
              {hasCustomImage && !uploading ? (
                <button
                  type="button"
                  onClick={() => updateField('image', DEFAULT_IMAGE)}
                  className="text-sm text-red-600 underline hover:text-red-800"
                >
                  Remove image
                </button>
              ) : null}
              {uploading ? <span className="text-xs text-black/60">Uploading...</span> : null}
            </div>
          </div>
        </Field>
      </div>

      <Field id="course-description" label="Description">
        <textarea
          id="course-description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          className={`min-h-[80px] ${inputClass}`}
        />
      </Field>

      <Field id="course-syllabus" label="Syllabus">
        <textarea
          id="course-syllabus"
          value={form.syllabus}
          onChange={(e) => updateField('syllabus', e.target.value)}
          className={`min-h-[80px] ${inputClass}`}
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-3">
        {(['technologies', 'skills', 'projects'] as const).map((field) => (
          <Field key={field} id={`course-${field}`} label={field.charAt(0).toUpperCase() + field.slice(1)} hint="Comma separated">
            <textarea
              id={`course-${field}`}
              value={form[field]}
              onChange={(e) => updateField(field, e.target.value)}
              className={`min-h-[90px] ${inputClass}`}
            />
          </Field>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="course-active"
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => updateField('isActive', e.target.checked)}
        />
        <label htmlFor="course-active" className="text-sm font-medium">
          Course is active
        </label>
      </div>

      {error ? (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="rounded-lg bg-[#0a0a0a] px-5 py-2.5 font-medium text-white transition hover:bg-black disabled:opacity-60"
        >
          {submitting ? 'Saving...' : mode === 'edit' ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}
