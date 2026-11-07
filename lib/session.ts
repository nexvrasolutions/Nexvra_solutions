import { SignJWT, jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be set to at least 32 characters.");
}

const secret = new TextEncoder().encode(jwtSecret);

export type AdminSession = {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
};

export async function createSessionToken(payload: AdminSession) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as AdminSession;
}
