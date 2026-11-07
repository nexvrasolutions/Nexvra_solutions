'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

type EnrollmentFormProps = {
  studentId: string;
  courses: { id: string; name: string; isActive: boolean }[];
};

export function EnrollmentForm({ studentId, courses }: EnrollmentFormProps) {
  const router = useRouter();
  const [courseId, setCourseId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/students/${studentId}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Unable to assign course.');
      }

      setCourseId('');
      setMessage('Course assignment saved.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to assign course.');
    } finally {
      setSubmitting(false);
    }
  }

  const selectClass = 'w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5';

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-xl font-semibold">Assign Course</h2>
      <p className="mb-4 text-sm text-black/60">Assigning a course that is already listed updates its status.</p>
      {courses.length === 0 ? (
        <p className="text-sm text-black/60">No courses exist yet. Create a course first.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1">
            <label htmlFor="enroll-course" className="mb-1 block text-sm font-medium">
              Course
            </label>
            <select
              id="enroll-course"
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              className={selectClass}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                  {course.isActive ? '' : ' (inactive)'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="enroll-status" className="mb-1 block text-sm font-medium">
              Status
            </label>
            <select
              id="enroll-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={selectClass}
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#0a0a0a] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Assign Course'}
          </button>
        </form>
      )}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="mt-3 text-sm text-green-700">
          {message}
        </p>
      ) : null}
    </section>
  );
}

type EnrollmentItem = {
  id: string;
  status: string;
  courseName: string;
  duration: string | null;
  completionDate: string | null;
};

export function EnrollmentList({ studentId, enrollments }: { studentId: string; enrollments: EnrollmentItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  async function remove(item: EnrollmentItem) {
    if (!window.confirm(`Remove "${item.courseName}" from this student?`)) return;
    setBusyId(item.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/students/${studentId}/enrollments/${item.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Unable to remove enrollment.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to remove enrollment.');
    } finally {
      setBusyId('');
    }
  }

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Course History</h2>
      {error ? (
        <p role="alert" className="mb-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {enrollments.length === 0 ? (
        <p className="text-sm text-black/60">No courses have been assigned yet.</p>
      ) : (
        <ul className="space-y-3">
          {enrollments.map((enrollment) => (
            <li
              key={enrollment.id}
              className="flex flex-col gap-3 rounded-lg border border-black/10 bg-[#f8f8f8] p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="break-words font-medium">{enrollment.courseName}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-black/60">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                      STATUS_STYLES[enrollment.status] ?? 'border-black/10'
                    }`}
                  >
                    {enrollment.status}
                  </span>
                  {enrollment.duration ? <span>{enrollment.duration}</span> : null}
                  {enrollment.completionDate ? (
                    <span>Completed {new Date(enrollment.completionDate).toLocaleDateString('en-IN')}</span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(enrollment)}
                disabled={busyId === enrollment.id}
                className="self-start text-sm font-medium text-red-600 underline disabled:opacity-60 sm:self-auto"
              >
                {busyId === enrollment.id ? 'Removing...' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
