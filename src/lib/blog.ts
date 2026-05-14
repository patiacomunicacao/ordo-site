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

export function getBlogPosts(): BlogPost[] {
  return getPublishedPosts().map(toPost);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const p = dbGetPostBySlug(slug);
  return p ? toPost(p) : undefined;
}

export function getRelatedPosts(slug: string): BlogPost[] {
  return dbGetRelatedPosts(slug).map(toPost);
}
