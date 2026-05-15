import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPosts, createPost } from "@/lib/db";
import type { DbPost } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await getPosts());
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = (await req.json()) as Omit<DbPost, "id" | "createdAt" | "updatedAt">;
  const post = await createPost(data);
  revalidatePath("/");
  revalidatePath("/blog");
  return NextResponse.json(post, { status: 201 });
}
