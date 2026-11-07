import { prisma } from "../lib/prisma";

async function main() {
  const oldEmail = "erroraction silentlycontinue";
  const newEmail = process.env.NEW_ADMIN_EMAIL?.trim().toLowerCase();

  if (!newEmail || !newEmail.includes("@")) {
    throw new Error("Please provide a valid email address.");
  }

  const existing = await prisma.adminUser.findUnique({
    where: { email: oldEmail },
  });

  if (!existing) {
    throw new Error("Incorrectly created admin account not found.");
  }

  const duplicate = await prisma.adminUser.findUnique({
    where: { email: newEmail },
  });

  if (duplicate) {
    throw new Error("The new email already belongs to another account.");
  }

  await prisma.adminUser.update({
    where: { email: oldEmail },
    data: { email: newEmail },
  });

  console.log("SUCCESS: Admin email corrected.");
  console.log("Email:", newEmail);
  console.log("Role: SUPER_ADMIN");
  console.log("Active: true");
}

main()
  .catch((error) => {
    console.error("FAILED:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });