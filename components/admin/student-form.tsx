'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type ProgramType = 'COURSE' | 'INTERNSHIP' | 'CUSTOM';

export type StudentFormInitial = {
  id?: string;
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  studentPhoto?: string | null;
  courseName?: string | null;
  department?: string | null;
  departmentId?: string | null;
  batchStartDate?: string;
  batchEndDate?: string;
  batch?: string | null;
  programType?: string;
  programTypeOptionId?: string | null;
  publicProfileEnabled?: boolean;
};

export type StudentFormOptions = {
  courses: { id: string; name: string }[];
  departments: { id: string; name: string }[];
  programTypes: { id: string; name: string; value: ProgramType }[];
};

/** Shown read-only: every certificate is issued by Nexvra Solutions. */
const NEXVRA_PROVIDER = 'Nexvra Solutions';
const CUSTOM = '__custom__';
const DEFAULT_PROGRAM_LABELS: Record<ProgramType, string> = {
  COURSE: 'Course',
  INTERNSHIP: 'Internship',
  CUSTOM: 'Custom',
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9][0-9\s-]{6,18}[0-9]$/;
const PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

const inputClass =
  'w-full rounded-lg border border-black/10 bg-[#f5f5f5] px-3 py-2.5 outline-none focus:border-[#a4ff00] disabled:opacity-60';

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-2 text-sm font-medium">
      <span>
        {children}
        {required ? (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      <span className="text-xs font-normal text-black/45">{required ? 'Required' : 'Optional'}</span>
    </label>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  const headingId = `section-${title.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  return (
    <section aria-labelledby={headingId} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 id={headingId} className="text-lg font-semibold">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-black/55">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** Initial select value: the matching option id, "custom" free text, or empty. */
function initialChoice(options: { id: string; name: string }[], id?: string | null, name?: string | null) {
  if (id && options.some((o) => o.id === id)) return id;
  const byName = name ? options.find((o) => o.name.toLowerCase() === name.toLowerCase()) : undefined;
  if (byName) return byName.id;
  return name ? CUSTOM : '';
}

export function StudentForm({
  mode = 'create',
  initialData,
  options,
}: {
  mode?: 'create' | 'edit';
  initialData?: StudentFormInitial;
  options: StudentFormOptions;
}) {
  const router = useRouter();
  const submittingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Student information
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [address, setAddress] = useState(initialData?.address || '');

  // Photo: the saved URL, plus a locally selected file that is uploaded on save.
  const [savedPhoto, setSavedPhoto] = useState<string | null>(initialData?.studentPhoto || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');

  // Course information
  const initialCourse = initialChoice(options.courses, null, initialData?.courseName);
  const [courseChoice, setCourseChoice] = useState(
    initialCourse || (options.courses.length === 0 ? CUSTOM : '')
  );
  const [courseCustom, setCourseCustom] = useState(initialCourse === CUSTOM ? initialData?.courseName || '' : '');
  const initialDepartment = initialChoice(options.departments, initialData?.departmentId, initialData?.department);
  const [departmentChoice, setDepartmentChoice] = useState(initialDepartment);
  const [departmentCustom, setDepartmentCustom] = useState(
    initialDepartment === CUSTOM ? initialData?.department || '' : ''
  );
  const [batchStartDate, setBatchStartDate] = useState(initialData?.batchStartDate || '');
  const [batchEndDate, setBatchEndDate] = useState(initialData?.batchEndDate || '');
  const [batch, setBatch] = useState(initialData?.batch || '');
  const [programType, setProgramType] = useState<ProgramType>(
    (initialData?.programType as ProgramType) || 'COURSE'
  );
  const [publicProfileEnabled, setPublicProfileEnabled] = useState(initialData?.publicProfileEnabled ?? true);

  // Until React has hydrated, a click would fall back to a native GET submit.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const busy = phase !== 'idle';
  const datesInvalid = Boolean(batchStartDate && batchEndDate && batchEndDate < batchStartDate);

  // Release the local preview URL when it is replaced or the form unmounts.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const programLabel = (value: ProgramType) =>
    options.programTypes.find((p) => p.value === value)?.name || DEFAULT_PROGRAM_LABELS[value];

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPhotoError('');
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      setPhotoError('Only JPG, JPEG, PNG and WEBP images are allowed.');
      event.target.value = '';
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setPhotoError('Photo must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setSavedPhoto(null);
    setPhotoError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function resolvedCourseName() {
    if (courseChoice === CUSTOM) return courseCustom.trim();
    return options.courses.find((c) => c.id === courseChoice)?.name || '';
  }

  function resolvedDepartment() {
    if (departmentChoice === CUSTOM) return { name: departmentCustom.trim(), id: null };
    const opt = options.departments.find((o) => o.id === departmentChoice);
    return opt ? { name: opt.name, id: opt.id } : { name: '', id: null };
  }

  function validate() {
    if (fullName.trim().length < 2) return 'Student full name must be at least 2 characters.';
    if (email.trim() && !EMAIL_RE.test(email.trim())) return 'Enter a valid email address or leave it empty.';
    if (phone.trim() && !PHONE_RE.test(phone.trim())) return 'Enter a valid contact number (8 to 20 digits) or leave it empty.';
    if (!courseChoice) return 'Select a course or choose "Custom course name".';
    if (resolvedCourseName().length < 2) return 'Enter the course name (at least 2 characters).';
    if (departmentChoice === CUSTOM && !departmentCustom.trim()) return 'Enter the department name or choose "Not specified".';
    if (!batchStartDate) return 'Batch start date is required.';
    if (!batchEndDate) return 'Batch completion date is required.';
    if (datesInvalid) return 'Batch completion date cannot be earlier than the start date.';
    return '';
  }

  async function uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'students');
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Photo upload failed.');
    return data.url as string;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submittingRef.current) return; // guard against double submits
    setError('');
    setMessage('');

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    submittingRef.current = true;
    try {
      let studentPhoto = savedPhoto;
      if (photoFile) {
        setPhase('uploading');
        try {
          studentPhoto = await uploadPhoto(photoFile);
        } catch (err) {
          throw new Error(
            `${err instanceof Error ? err.message : 'Photo upload failed.'} The student was not saved; remove the photo to save without it.`
          );
        }
      }

      setPhase('saving');
      const department = resolvedDepartment();
      const programOption = options.programTypes.find((p) => p.value === programType);
      const response = await fetch(
        mode === 'edit' && initialData?.id ? `/api/admin/students/${initialData.id}` : '/api/admin/students',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
            studentPhoto,
            courseName: resolvedCourseName(),
            department: department.name,
            departmentId: department.id,
            batchStartDate,
            batchEndDate,
            batch: batch.trim(),
            programType,
            programTypeOptionId: programOption?.id ?? null,
            publicProfileEnabled,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Unable to save student.');
      }

      if (mode === 'edit') {
        setSavedPhoto(data.student?.studentPhoto ?? null);
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setMessage('Student updated successfully.');
        router.refresh();
      } else {
        router.push(`/admin/students/${data.student.id}?created=1`);
        router.refresh();
        return; // keep the form disabled while navigating
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
    submittingRef.current = false;
    setPhase('idle');
  };

  const shownPhoto = photoPreview || savedPhoto;
  const submitLabel =
    phase === 'uploading'
      ? 'Uploading photo...'
      : phase === 'saving'
        ? 'Saving...'
        : mode === 'edit'
          ? 'Update Student'
          : 'Create Student';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-busy={busy}>
      <Section title="Student Information" description="Contact details are visible to admins only.">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FieldLabel htmlFor="student-name" required>
              Student Full Name
            </FieldLabel>
            <input
              id="student-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={120}
              autoComplete="off"
              className={inputClass}
              disabled={busy}
              required
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel htmlFor="student-photo">Student Photo</FieldLabel>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#f5f5f5]">
                {shownPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local blob preview or storage URL
                  <img src={shownPhoto} alt="Student photo preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="px-2 text-center text-xs text-black/45">No photo</span>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  id="student-photo"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  disabled={busy}
                  className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#0a0a0a] file:px-3 file:py-1.5 file:text-sm file:text-white`}
                />
                <p className="text-xs text-black/50">
                  JPG, JPEG, PNG or WEBP, up to 5 MB. Choose another file to replace the photo.
                  {photoFile ? ' The photo uploads when you save.' : ''}
                </p>
                {shownPhoto ? (
                  <button
                    type="button"
                    onClick={removePhoto}
                    disabled={busy}
                    className="text-sm text-red-600 underline hover:text-red-800 disabled:opacity-60"
                  >
                    Remove photo
                  </button>
                ) : null}
                {photoError ? (
                  <p role="alert" className="text-sm text-red-600">
                    {photoError}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="student-email">Email Address</FieldLabel>
            <input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              placeholder="name@example.com"
              className={inputClass}
              disabled={busy}
            />
          </div>

          <div>
            <FieldLabel htmlFor="student-phone">Contact Number</FieldLabel>
            <input
              id="student-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={inputClass}
              disabled={busy}
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel htmlFor="student-address">Student Address</FieldLabel>
            <textarea
              id="student-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={500}
              rows={2}
              className={inputClass}
              disabled={busy}
            />
          </div>
        </div>
      </Section>

      <Section title="Course Information" description="Shown on the public QR verification page.">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FieldLabel htmlFor="student-course" required>
              Course Name
            </FieldLabel>
            <select
              id="student-course"
              value={courseChoice}
              onChange={(e) => setCourseChoice(e.target.value)}
              className={inputClass}
              disabled={busy}
              required
            >
              <option value="">Select a course…</option>
              {options.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
              <option value={CUSTOM}>Custom course name (type any name)</option>
            </select>
            {courseChoice === CUSTOM ? (
              <div className="mt-2">
                <label htmlFor="student-course-custom" className="mb-1 block text-xs font-medium text-black/60">
                  Custom course name
                </label>
                <input
                  id="student-course-custom"
                  value={courseCustom}
                  onChange={(e) => setCourseCustom(e.target.value)}
                  maxLength={160}
                  placeholder="e.g. Full Stack Web Development"
                  className={inputClass}
                  disabled={busy}
                  required
                />
              </div>
            ) : null}
          </div>

          <div>
            <FieldLabel htmlFor="student-department">Department</FieldLabel>
            <select
              id="student-department"
              value={departmentChoice}
              onChange={(e) => setDepartmentChoice(e.target.value)}
              className={inputClass}
              disabled={busy}
            >
              <option value="">Not specified</option>
              {options.departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
              <option value={CUSTOM}>Other (type a name)</option>
            </select>
            {departmentChoice === CUSTOM ? (
              <div className="mt-2">
                <label htmlFor="student-department-custom" className="mb-1 block text-xs font-medium text-black/60">
                  Custom department name
                </label>
                <input
                  id="student-department-custom"
                  value={departmentCustom}
                  onChange={(e) => setDepartmentCustom(e.target.value)}
                  maxLength={120}
                  className={inputClass}
                  disabled={busy}
                />
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="student-program" className="mb-2 flex items-baseline justify-between text-sm font-medium">
              <span>Program Type</span>
              <span className="text-xs font-normal text-black/45">Optional</span>
            </label>
            <select
              id="student-program"
              value={programType}
              onChange={(e) => setProgramType(e.target.value as ProgramType)}
              className={inputClass}
              disabled={busy}
            >
              {(Object.keys(DEFAULT_PROGRAM_LABELS) as ProgramType[]).map((value) => (
                <option key={value} value={value}>
                  {programLabel(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="student-institute" className="mb-2 flex items-baseline justify-between text-sm font-medium">
              <span>Institute / Organization</span>
              <span className="text-xs font-normal text-black/45">Fixed</span>
            </label>
            <input id="student-institute" value={NEXVRA_PROVIDER} readOnly aria-readonly="true" className={`${inputClass} cursor-not-allowed text-black/70`} />
          </div>

          <div>
            <label htmlFor="student-learned-from" className="mb-2 flex items-baseline justify-between text-sm font-medium">
              <span>Learned From</span>
              <span className="text-xs font-normal text-black/45">Fixed</span>
            </label>
            <input id="student-learned-from" value={NEXVRA_PROVIDER} readOnly aria-readonly="true" className={`${inputClass} cursor-not-allowed text-black/70`} />
          </div>

          <div>
            <FieldLabel htmlFor="student-batch-start" required>
              Batch Start Date (From)
            </FieldLabel>
            <input
              id="student-batch-start"
              type="date"
              value={batchStartDate}
              onChange={(e) => setBatchStartDate(e.target.value)}
              max={batchEndDate || undefined}
              className={inputClass}
              disabled={busy}
              required
            />
          </div>

          <div>
            <FieldLabel htmlFor="student-batch-end" required>
              Batch Completion Date (To)
            </FieldLabel>
            <input
              id="student-batch-end"
              type="date"
              value={batchEndDate}
              onChange={(e) => setBatchEndDate(e.target.value)}
              min={batchStartDate || undefined}
              aria-invalid={datesInvalid}
              className={`${inputClass} ${datesInvalid ? 'border-red-400' : ''}`}
              disabled={busy}
              required
            />
            {datesInvalid ? (
              <p className="mt-1 text-xs text-red-600">Completion date cannot be earlier than the start date.</p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <FieldLabel htmlFor="student-batch">Batch Name / Code</FieldLabel>
            <input
              id="student-batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              maxLength={60}
              placeholder="e.g. 2026-A"
              className={inputClass}
              disabled={busy}
            />
          </div>
        </div>
      </Section>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <input
            id="student-public"
            type="checkbox"
            checked={publicProfileEnabled}
            onChange={(e) => setPublicProfileEnabled(e.target.checked)}
            disabled={busy}
          />
          <label htmlFor="student-public" className="text-sm font-medium">
            Enable public student profile
          </label>
        </div>
        <p className="mt-1 pl-7 text-xs text-black/50">When disabled, the student&apos;s QR code shows “not found”.</p>

        {error ? (
          <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        ) : null}
        {message ? (
          <div role="status" className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-end gap-3">
          <span className="text-xs text-black/45">
            <span className="text-red-600">*</span> Required field
          </span>
          <button
            type="submit"
            disabled={busy || !hydrated}
            className="rounded-lg bg-[#0a0a0a] px-5 py-2.5 font-medium text-white transition hover:bg-black disabled:opacity-60"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
