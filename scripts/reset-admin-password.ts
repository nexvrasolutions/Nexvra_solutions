import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error("Admin email and password (minimum 12 characters) are required.");
  }

  // Match the login route: emails are compared case-insensitively, so an
  // address stored with capitals (e.g. "Contact...@gmail.com") is still found.
  const admin = await prisma.adminUser.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (!admin) {
    throw new Error(`Admin not found: ${email}`);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.update({
    where: { email },
    data: {
      passwordHash,
      isActive: true,
    },
  });

  // A new password signs the admin out on every device.
  const { count } = await prisma.adminSession.updateMany({
    where: { adminUserId: admin.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  console.log("SUCCESS: Admin password reset.");
  console.log("Signed-in sessions revoked:", count);
  console.log("Email:", admin.email);
  console.log("Role:", admin.role);
  console.log("Active: true");
}

main()
  .catch((error) => {
    console.error("RESET FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
