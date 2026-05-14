import fs from "fs";
import path from "path";

export interface DbPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  tag: string;
  readingTime: number;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  author: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readAll(): DbPost[] {
  ensureDir();
  if (!fs.existsSync(POSTS_FILE)) {
    seedInitial();
  }
  try {
    return JSON.parse(fs.readFileSync(POSTS_FILE, "utf-8")) as DbPost[];
  } catch {
    return [];
  }
}

function writeAll(posts: DbPost[]): void {
  ensureDir();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

function seedInitial(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { BLOG_POSTS } = require("@/data/blog-posts") as {
      BLOG_POSTS: Array<{
        slug: string;
        title: string;
        summary: string;
        date: string;
        tag: string;
        readingTime: number;
        content: string;
      }>;
    };
    const now = new Date().toISOString();
    const seeded: DbPost[] = BLOG_POSTS.map((p) => ({
      id: crypto.randomUUID(),
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      content: p.content,
      coverImage: "",
      coverAlt: "",
      tag: p.tag,
      readingTime: p.readingTime,
      status: "published" as const,
      seoTitle: "",
      seoDescription: "",
      ogImage: "",
      author: "ORDO",
      publishedAt: p.date,
      createdAt: now,
      updatedAt: now,
    }));
    writeAll(seeded);
  } catch {
    writeAll([]);
  }
}

// ─── Public reads ─────────────────────────────────────────────────────────────

export function getPosts(): DbPost[] {
  return readAll();
}

export function getPublishedPosts(): DbPost[] {
  return readAll()
    .filter((p) => p.status === "published")
    .sort((a, b) => {
      const da = a.publishedAt ?? a.createdAt;
      const db = b.publishedAt ?? b.createdAt;
      return new Date(db).getTime() - new Date(da).getTime();
    });
}

export function getPostById(id: string): DbPost | undefined {
  return readAll().find((p) => p.id === id);
}

export function getPostBySlug(slug: string): DbPost | undefined {
  return readAll().find((p) => p.slug === slug && p.status === "published");
}

export function getRelatedPosts(slug: string): DbPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  return getPublishedPosts()
    .filter((p) => p.slug !== slug && p.tag === post.tag)
    .slice(0, 2);
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function createPost(
  data: Omit<DbPost, "id" | "createdAt" | "updatedAt">
): DbPost {
  const posts = readAll();
  const now = new Date().toISOString();
  const post: DbPost = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  writeAll([...posts, post]);
  return post;
}

export function updatePost(
  id: string,
  data: Partial<Omit<DbPost, "id" | "createdAt">>
): DbPost | null {
  const posts = readAll();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = { ...posts[idx], ...data, updatedAt: new Date().toISOString() };
  posts[idx] = updated;
  writeAll(posts);
  return updated;
}

export function deletePost(id: string): boolean {
  const posts = readAll();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  writeAll(filtered);
  return true;
}
