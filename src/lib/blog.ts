import {
  getPublishedPosts,
  getPostBySlug as dbGetPostBySlug,
  getRelatedPosts as dbGetRelatedPosts,
} from "@/lib/db";
import type { DbPost } from "@/lib/db";
import type { BlogPost } from "@/types";

function toPost(p: DbPost): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    date: p.publishedAt ?? p.createdAt,
    tag: p.tag,
    readingTime: p.readingTime,
    content: p.content,
    coverImage: p.coverImage || undefined,
    coverAlt: p.coverAlt || undefined,
    seoTitle: p.seoTitle || undefined,
    seoDescription: p.seoDescription || undefined,
    ogImage: p.ogImage || undefined,
    author: p.author,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await getPublishedPosts()).map(toPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const p = await dbGetPostBySlug(slug);
  return p ? toPost(p) : undefined;
}

export async function getRelatedPosts(slug: string): Promise<BlogPost[]> {
  return (await dbGetRelatedPosts(slug)).map(toPost);
}
