import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPostById, updatePost, deletePost } from "@/lib/db";
import type { DbPost } from "@/lib/db";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const { id } = await params;
  const data = (await req.json()) as Partial<Omit<DbPost, "id" | "createdAt">>;
  const post = await updatePost(id, data);
  if (!post) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const { id } = await params;
  const post = await getPostById(id);
  const ok = await deletePost(id);
  if (!ok) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  revalidatePath("/");
  revalidatePath("/blog");
  if (post) revalidatePath(`/blog/${post.slug}`);
  return NextResponse.json({ success: true });
}
