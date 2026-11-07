import { prisma } from "../lib/prisma";

async function main() {
  console.log("=== Prisma Database Query Test ===");

  const result = await prisma.$queryRaw`SELECT 1 AS alive`;
  console.log("  RESULT: SUCCESS");
  console.log("  rows:", JSON.stringify(result));

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("  RESULT: FAILED:", err.code, err.message);
  process.exit(1);
});
