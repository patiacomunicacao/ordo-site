import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/knowledge";
import type { KnowledgeBase } from "@/lib/knowledge";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const kb = (await req.json()) as KnowledgeBase;
  return NextResponse.json({ prompt: buildSystemPrompt(kb) });
}
