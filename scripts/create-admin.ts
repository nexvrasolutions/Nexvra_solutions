import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const fullName = process.env.ADMIN_FULL_NAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !fullName || !password || password.length < 12) {
    throw new Error(
      "Provide a valid email, full name, and password of at least 12 characters."
    );
  }

  const existing = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("This email already exists. No account was changed.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.create({
    data: {
      email,
      fullName,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
    },
  });

  console.log("SUCCESS: Super Admin created.");
  console.log(JSON.stringify(admin, null, 2));
}

main()
  .catch((error) => {
    console.error("ADMIN CREATION FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });