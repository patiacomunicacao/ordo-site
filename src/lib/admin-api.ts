import { NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { firstIssueMessage } from "@/lib/validations";

type Parsed<T> = { data: T; error?: never } | { data?: never; error: NextResponse };

/**
 * Lê o corpo JSON e valida com o schema. Em caso de falha, devolve a
 * resposta de erro pronta (400 para JSON inválido, 422 para validação).
 */
export async function parseBody<S extends z.ZodType>(
  req: NextRequest,
  schema: S
): Promise<Parsed<z.output<S>>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { error: NextResponse.json({ error: "Payload inválido" }, { status: 400 }) };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      error: NextResponse.json(
        { error: firstIssueMessage(result.error), issues: result.error.issues },
        { status: 422 }
      ),
    };
  }
  return { data: result.data };
}

/** Violação de UNIQUE no Postgres (ex.: slug repetido). */
export function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "23505";
}
