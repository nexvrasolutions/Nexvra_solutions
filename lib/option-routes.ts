import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { jsonError, prismaErrorResponse, readJson, requireSuperAdmin, unauthorized, zodMessage } from '@/lib/api';
import { PROGRAM_TYPES, optionNameSchema } from '@/lib/validation';

/** Minimal shape shared by the Department, Institution and ProgramTypeOption delegates. */
interface OptionDelegate {
  findMany(args: { orderBy: { name: 'asc' } }): Promise<unknown[]>;
  findUnique(args: { where: { id: string } }): Promise<unknown | null>;
  create(args: { data: Record<string, unknown> }): Promise<unknown>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>;
  delete(args: { where: { id: string } }): Promise<unknown>;
}

type OptionKind = {
  delegate: () => OptionDelegate;
  /** singular JSON key / entity label, e.g. "department" */
  key: string;
  /** plural JSON key for lists, e.g. "departments" */
  listKey: string;
  label: string;
  hasValue?: boolean;
};

const valueSchema = z.enum(PROGRAM_TYPES, { message: 'Select a valid program type.' });

export const OPTION_KINDS = {
  departments: {
    delegate: () => prisma.department as unknown as OptionDelegate,
    key: 'department',
    listKey: 'departments',
    label: 'department',
  },
  institutions: {
    delegate: () => prisma.institution as unknown as OptionDelegate,
    key: 'institution',
    listKey: 'institutions',
    label: 'institution',
  },
  programTypes: {
    delegate: () => prisma.programTypeOption as unknown as OptionDelegate,
    key: 'programType',
    listKey: 'programTypes',
    label: 'program type',
    hasValue: true,
  },
} satisfies Record<string, OptionKind>;

type Params = { params: Promise<{ id: string }> };

export function collectionHandlers(kind: OptionKind) {
  const createSchema = z.object({
    name: optionNameSchema,
    ...(kind.hasValue ? { value: valueSchema } : {}),
  });

  async function GET() {
    if (!(await requireSuperAdmin())) return unauthorized();
    const items = await kind.delegate().findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ [kind.listKey]: items });
  }

  async function POST(request: Request) {
    if (!(await requireSuperAdmin())) return unauthorized();
    const parsed = createSchema.safeParse(await readJson(request));
    if (!parsed.success) return jsonError(zodMessage(parsed.error, `Invalid ${kind.label} data.`), 400);
    try {
      const item = await kind.delegate().create({ data: parsed.data });
      return NextResponse.json({ [kind.key]: item }, { status: 201 });
    } catch (error) {
      return prismaErrorResponse(error, kind.label, `Unable to create ${kind.label}.`);
    }
  }

  return { GET, POST };
}

export function itemHandlers(kind: OptionKind) {
  const updateSchema = z.object({
    name: optionNameSchema.optional(),
    isActive: z.boolean().optional(),
    ...(kind.hasValue ? { value: valueSchema.optional() } : {}),
  });

  async function GET(_request: Request, { params }: Params) {
    if (!(await requireSuperAdmin())) return unauthorized();
    const { id } = await params;
    const item = await kind.delegate().findUnique({ where: { id } });
    if (!item) return jsonError(`${kind.label.charAt(0).toUpperCase()}${kind.label.slice(1)} not found.`, 404);
    return NextResponse.json({ [kind.key]: item });
  }

  async function PUT(request: Request, { params }: Params) {
    if (!(await requireSuperAdmin())) return unauthorized();
    const parsed = updateSchema.safeParse(await readJson(request));
    if (!parsed.success) return jsonError(zodMessage(parsed.error, `Invalid ${kind.label} data.`), 400);
    try {
      const { id } = await params;
      const data = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined));
      const item = await kind.delegate().update({ where: { id }, data });
      return NextResponse.json({ [kind.key]: item });
    } catch (error) {
      return prismaErrorResponse(error, kind.label, `Unable to update ${kind.label}.`);
    }
  }

  async function DELETE(_request: Request, { params }: Params) {
    if (!(await requireSuperAdmin())) return unauthorized();
    try {
      const { id } = await params;
      await kind.delegate().delete({ where: { id } });
      return NextResponse.json({ message: `${kind.label} deleted successfully.` });
    } catch (error) {
      return prismaErrorResponse(error, kind.label, `Unable to delete ${kind.label}.`);
    }
  }

  return { GET, PUT, DELETE };
}
