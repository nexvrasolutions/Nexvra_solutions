import { z } from 'zod';

export const PROGRAM_TYPES = ['COURSE', 'INTERNSHIP', 'CUSTOM'] as const;
export const ENROLLMENT_STATUSES = ['ACTIVE', 'COMPLETED', 'REJECTED'] as const;

const optionalText = (label: string, max = 120) =>
  z.string().trim().max(max, `${label} must be at most ${max} characters.`);

const optionalId = z.string().trim().min(1).nullable().optional();

/** Every certificate is issued by Nexvra Solutions; this is never taken from user input. */
export const NEXVRA_PROVIDER = 'Nexvra Solutions';

export const PHONE_RE = /^\+?[0-9][0-9\s-]{6,18}[0-9]$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Empty strings and null both mean "not provided" for optional fields. */
const emptyToNull = (value: unknown) => (typeof value === 'string' && value.trim() === '' ? null : value);

const optionalEmail = z.preprocess(
  emptyToNull,
  z.string().trim().toLowerCase().email('Enter a valid email address.').max(200).nullable()
);
const optionalPhone = z.preprocess(
  emptyToNull,
  z.string().trim().regex(PHONE_RE, 'Enter a valid contact number (8 to 20 digits).').nullable()
);
const optionalAddress = z.preprocess(
  emptyToNull,
  z.string().trim().max(500, 'Address must be at most 500 characters.').nullable()
);
const courseName = z
  .string({ message: 'Course name is required.' })
  .trim()
  .min(2, 'Course name must be at least 2 characters.')
  .max(160, 'Course name must be at most 160 characters.');

const batchDate = (label: string) =>
  z
    .string({ message: `${label} is required.` })
    .trim()
    .regex(DATE_RE, `${label} is required.`)
    .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), `${label} is not a valid date.`);

/** Student photos must be files we uploaded to the students/ folder of our bucket. */
export function isAllowedStudentPhoto(value: string) {
  const supabase = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  return Boolean(
    supabase &&
      value.startsWith(`${supabase}/storage/v1/object/public/course-images/students/`) &&
      !value.includes('..')
  );
}

const studentPhoto = z.preprocess(
  emptyToNull,
  z.string().trim().refine(isAllowedStudentPhoto, 'Student photo must be an uploaded image.').nullable()
);

const batchOrderMessage = 'Batch completion date cannot be earlier than the start date.';

export const studentCreateSchema = z
  .object({
    fullName: z
      .string({ message: 'Full name is required.' })
      .trim()
      .min(2, 'Full name must be at least 2 characters.')
      .max(120, 'Full name must be at most 120 characters.'),
    email: optionalEmail.optional().default(null),
    phone: optionalPhone.optional().default(null),
    address: optionalAddress.optional().default(null),
    studentPhoto: studentPhoto.optional().default(null),
    courseName,
    department: optionalText('Department').optional().default(''),
    departmentId: optionalId,
    batchStartDate: batchDate('Batch start date'),
    batchEndDate: batchDate('Batch completion date'),
    batch: optionalText('Batch name', 60).optional().default(''),
    programType: z.enum(PROGRAM_TYPES, { message: 'Select a valid program type.' }).optional().default('COURSE'),
    programTypeOptionId: optionalId,
    publicProfileEnabled: z.boolean().optional().default(true),
  })
  .refine((v) => v.batchEndDate >= v.batchStartDate, { message: batchOrderMessage, path: ['batchEndDate'] });

export const studentUpdateSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters.')
      .max(120, 'Full name must be at most 120 characters.')
      .optional(),
    email: optionalEmail.optional(),
    phone: optionalPhone.optional(),
    address: optionalAddress.optional(),
    studentPhoto: studentPhoto.optional(),
    courseName: courseName.optional(),
    department: optionalText('Department').optional(),
    departmentId: optionalId,
    batchStartDate: batchDate('Batch start date').optional(),
    batchEndDate: batchDate('Batch completion date').optional(),
    batch: optionalText('Batch name', 60).optional(),
    programType: z.enum(PROGRAM_TYPES, { message: 'Select a valid program type.' }).optional(),
    programTypeOptionId: optionalId,
    publicProfileEnabled: z.boolean().optional(),
  })
  .refine((v) => !v.batchStartDate || !v.batchEndDate || v.batchEndDate >= v.batchStartDate, {
    message: batchOrderMessage,
    path: ['batchEndDate'],
  });

export { batchOrderMessage };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Course images may be a bundled /images path or a file in our Supabase bucket. */
export function isAllowedCourseImage(value: string) {
  if (value.startsWith('/images/')) return !value.includes('..');
  const supabase = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  return Boolean(supabase && value.startsWith(`${supabase}/storage/v1/object/public/course-images/`));
}

const courseImage = z
  .string()
  .trim()
  .refine(isAllowedCourseImage, 'Course image must be an uploaded image or a bundled /images path.');

export const courseCreateSchema = z.object({
  code: z.string().trim().min(2, 'Course code must be at least 2 characters.').max(40),
  name: z.string().trim().min(2, 'Course name must be at least 2 characters.').max(160),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, 'Slug must be at least 2 characters.')
    .max(120)
    .regex(SLUG_RE, 'Slug may only contain lowercase letters, numbers and single hyphens.'),
  description: z.string().max(5000).optional().default(''),
  duration: z.string().trim().max(60).optional().default(''),
  syllabus: z.string().max(10000).optional().default(''),
  technologies: z.string().max(2000).optional().default(''),
  skills: z.string().max(2000).optional().default(''),
  projects: z.string().max(2000).optional().default(''),
  level: z.string().trim().max(60).optional().default('Beginner'),
  image: courseImage.optional().default('/images/courses/front_end.webp'),
  isActive: z.boolean().optional().default(true),
});

export const courseUpdateSchema = z.object({
  code: courseCreateSchema.shape.code.optional(),
  name: courseCreateSchema.shape.name.optional(),
  slug: courseCreateSchema.shape.slug.optional(),
  description: z.string().max(5000).optional(),
  duration: z.string().trim().max(60).optional(),
  syllabus: z.string().max(10000).optional(),
  technologies: z.string().max(2000).optional(),
  skills: z.string().max(2000).optional(),
  projects: z.string().max(2000).optional(),
  level: z.string().trim().max(60).optional(),
  image: courseImage.optional(),
  isActive: z.boolean().optional(),
});

export const optionNameSchema = z.string().trim().min(1, 'Name is required.').max(100, 'Name must be at most 100 characters.');

/** Storage path of a course image inside the bucket, if it is one of ours. */
export function storagePathFromUrl(url: string | null | undefined) {
  if (!url) return undefined;
  const marker = '/storage/v1/object/public/course-images/';
  const index = url.indexOf(marker);
  return index === -1 ? undefined : url.slice(index + marker.length);
}
