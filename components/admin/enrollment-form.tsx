'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type EnrollmentFormProps = {
  studentId: string;
  courses: { id: string; name: string }[];
};

export function EnrollmentForm({ studentId, courses }: EnrollmentFormProps) {
  const router = useRouter();
  const [courseId, setCourseId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/students/${studentId}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, status }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to assign course.');
      }

      setCourseId('');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to assign course.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Assign Course</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
        <select
          name="courseId"
          value={courseId}
          onChange={(event) => setCourseId(event.target.value)}
          className="w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5"
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
        <select
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5"
        >
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[#0a0a0a] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Assign Course'}
        </button>
      </form>
      {error ? <p role="alert" className="mt-3 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
