import { prisma } from '@/lib/prisma';
import type { StudentFormOptions } from '@/components/admin/student-form';

/**
 * Dropdown options for the student form, loaded on the server. Catalog courses
 * are only suggestions: the form always offers a custom course name.
 */
export async function getStudentFormOptions(): Promise<StudentFormOptions> {
  const [courses, departments, programTypes] = await Promise.all([
    prisma.course.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.department.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.programTypeOption.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, value: true },
    }),
  ]);
  return { courses, departments, programTypes };
}
