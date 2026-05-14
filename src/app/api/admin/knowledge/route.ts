import { NextRequest, NextResponse } from "next/server";
import { getKnowledgeBase, saveKnowledgeBase } from "@/lib/knowledge";
import type { KnowledgeBase } from "@/lib/knowledge";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(getKnowledgeBase());
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const data = (await req.json()) as KnowledgeBase;
  saveKnowledgeBase(data);
  return NextResponse.json({ success: true });
}
