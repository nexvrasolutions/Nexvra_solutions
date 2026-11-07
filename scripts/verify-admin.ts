import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Admin email and password are required.");
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin) {
    console.log("ADMIN_NOT_FOUND");
    return;
  }

  console.log("Admin found:", admin.email);
  console.log("Role:", admin.role);
  console.log("Active:", admin.isActive);

  const matches = await bcrypt.compare(password, admin.passwordHash);

  console.log("PASSWORD_MATCH:", matches);
}

main()
  .catch((error) => {
    console.error("Verification failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });