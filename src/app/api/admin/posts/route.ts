import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPosts, createPost } from "@/lib/db";
import { parseBody, isUniqueViolation } from "@/lib/admin-api";
import { PostCreateSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await getPosts());
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { data, error } = await parseBody(req, PostCreateSchema);
  if (error) return error;

  try {
    const post = await createPost({
      summary: "",
      content: "",
      coverImage: "",
      coverAlt: "",
      tag: "",
      readingTime: 1,
      status: "draft",
      seoTitle: "",
      seoDescription: "",
      ogImage: "",
      author: "ORDO",
      publishedAt: null,
      ...data,
    });
    revalidatePath("/");
    revalidatePath("/blog");
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json(
        { error: "Já existe um post com este slug. Escolha outro." },
        { status: 409 }
      );
    }
    throw err;
  }
}
