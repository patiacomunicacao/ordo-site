import { notFound } from "next/navigation";
import { getPostById } from "@/lib/db";
import PostForm from "@/components/admin/PostForm";

export const metadata = { title: "Editar post" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) notFound();
  return <PostForm post={post} />;
}
