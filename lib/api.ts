import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import type { ZodError } from 'zod';
import { getActiveAdminFromCookies } from '@/lib/auth';

export function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export const unauthorized = () => jsonError('Unauthorized.', 401);

export async function requireAdmin() {
  return getActiveAdminFromCookies();
}

export async function requireSuperAdmin() {
  const admin = await getActiveAdminFromCookies();
  return admin && admin.role === 'SUPER_ADMIN' ? admin : null;
}

/** Parses a JSON body; returns undefined when the body is missing or malformed. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

/** First validation message, prefixed with the field name, for display in forms. */
export function zodMessage(error: ZodError, fallback: string) {
  const issue = error.issues[0];
  if (!issue) return fallback;
  return issue.message || fallback;
}

/**
 * Maps known Prisma errors to proper HTTP responses so a duplicate or missing
 * record is reported as 409/404 instead of a generic 500.
 */
export function prismaErrorResponse(error: unknown, entity: string, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = Array.isArray(error.meta?.target) ? (error.meta?.target as string[]).join(', ') : 'value';
      return jsonError(`A ${entity} with this ${target} already exists.`, 409);
    }
    if (error.code === 'P2025') {
      return jsonError(`${entity.charAt(0).toUpperCase()}${entity.slice(1)} not found.`, 404);
    }
    if (error.code === 'P2003') {
      return jsonError(`Related record for this ${entity} does not exist.`, 400);
    }
  }
  console.error(fallback, error);
  return jsonError(fallback, 500);
}

export function splitList(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
