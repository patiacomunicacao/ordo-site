import { NextRequest, NextResponse } from "next/server";
import { getKnowledgeBase, saveKnowledgeBase } from "@/lib/knowledge";
import { parseBody } from "@/lib/admin-api";
import { KnowledgeBaseSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await getKnowledgeBase());
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const { data, error } = await parseBody(req, KnowledgeBaseSchema);
  if (error) return error;

  await saveKnowledgeBase(data);
  return NextResponse.json({ success: true });
}
