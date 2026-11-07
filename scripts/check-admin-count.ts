import { prisma } from "../lib/prisma";

async function main() {
  try {
    const count = await prisma.adminUser.count();
    console.log("Admin accounts:", count);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("FAILED:", err.code, err.message);
  process.exit(1);
});
