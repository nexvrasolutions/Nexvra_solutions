const fs = require("node:fs");
const { Pool } = require("pg");

const caPath = process.env.SUPABASE_CA_CERT;
const password = process.env.DB_POOLER_PASSWORD;
const projectRef = "fckathcrvymddzynvuak";

if (!password || !caPath) {
  console.error("Missing DB_POOLER_PASSWORD or SUPABASE_CA_CERT");
  process.exit(1);
}

const ca = fs.readFileSync(caPath, "utf8");

console.log("=== PostgreSQL SELECT 1 Test ===");
console.log("  host: aws-0-eu-west-1.pooler.supabase.com");
console.log("  port: 5432");
console.log("  user: postgres.fckathcrvymddzynvuak");
console.log("  database: postgres");

const pool = new Pool({
  host: "aws-0-eu-west-1.pooler.supabase.com",
  port: 5432,
  user: `postgres.${projectRef}`,
  password,
  database: "postgres",
  ssl: { ca, rejectUnauthorized: false },
  max: 1,
  connectionTimeoutMillis: 15_000,
});

const timeout = setTimeout(() => {
  console.error("  RESULT: TIMEOUT");
  pool.end();
  process.exit(1);
}, 15_000);

pool.query("SELECT 1 AS alive")
  .then((result) => {
    clearTimeout(timeout);
    console.log("  RESULT: SUCCESS");
    console.log("  rows:", JSON.stringify(result.rows));
    pool.end();
    process.exit(0);
  })
  .catch((err) => {
    clearTimeout(timeout);
    console.error("  RESULT: FAILED:", err.code, err.message);
    pool.end();
    process.exit(1);
  });
