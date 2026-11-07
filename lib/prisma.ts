import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const poolerHost = process.env.DB_POOLER_HOST || "aws-0-eu-west-1.pooler.supabase.com";
const poolerPort = Number(process.env.DB_POOLER_PORT || "5432");
const poolerUser = process.env.DB_POOLER_USER || "postgres";
const poolerPassword = process.env.DB_POOLER_PASSWORD;

/** Supabase's public root CA, committed to the repo and traced into the server bundle (next.config.ts). */
const BUNDLED_CA = path.join(process.cwd(), "supabase-ca.cer", "prod-ca-2021.crt");

/**
 * The CA can come from SUPABASE_CA_CERT_PEM (the certificate text, for hosts
 * without the file), from SUPABASE_CA_CERT (a file path, e.g. for local
 * machines), or from the bundled copy. A configured path that does not exist on
 * this machine (such as a Windows path on Vercel) falls back to the bundled file.
 */
function loadSupabaseCa() {
  const pem = process.env.SUPABASE_CA_CERT_PEM?.trim();
  if (pem) return pem.replace(/\\n/g, "\n");
  for (const candidate of [process.env.SUPABASE_CA_CERT?.trim(), BUNDLED_CA]) {
    if (candidate && existsSync(candidate)) return readFileSync(candidate, "utf8");
  }
  throw new Error("Supabase CA certificate not found. Set SUPABASE_CA_CERT_PEM or SUPABASE_CA_CERT.");
}

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    host: poolerHost,
    port: poolerPort,
    user: poolerUser,
    password: poolerPassword,
    database: "postgres",
    ssl: {
      ca: loadSupabaseCa(),
      // Verify the server certificate against the Supabase CA (prevents MITM).
      rejectUnauthorized: true,
    },
    max: 1,
    connectionTimeoutMillis: 15_000,
    idleTimeoutMillis: 30_000,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pgPool = pool;
  globalForPrisma.prisma = prisma;
}
