import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { courses as staticCourses } from '../data/courses';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured before production seeding.');
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nexvra.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      fullName: 'Nexvra Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
    create: {
      email: adminEmail,
      fullName: 'Nexvra Super Admin',
      role: 'SUPER_ADMIN',
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  for (const [slug, course] of Object.entries(staticCourses)) {
    await prisma.course.upsert({
      where: { slug },
      update: {
        name: course.title,
        description: course.description,
        duration: course.duration,
        syllabus: course.overview,
        technologies: course.learn,
        skills: course.learn,
        projects: course.learn,
        isActive: true,
        level: course.level,
      },
      create: {
        code: slug.replace(/-/g, '').slice(0, 12).toUpperCase(),
        slug,
        name: course.title,
        description: course.description,
        duration: course.duration,
        syllabus: course.overview,
        technologies: course.learn,
        skills: course.learn,
        projects: course.learn,
        isActive: true,
        level: course.level,
      },
    });
  }

  console.log('Seeded admin user and course catalog.');
  console.log('Admin email:', admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
