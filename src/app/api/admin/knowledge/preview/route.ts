import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/knowledge";
import { getSiteConfig } from "@/lib/site-config";
import { parseBody } from "@/lib/admin-api";
import { KnowledgePromptSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { data, error } = await parseBody(req, KnowledgePromptSchema);
  if (error) return error;

  return NextResponse.json({ prompt: buildSystemPrompt(data, await getSiteConfig()) });
}
