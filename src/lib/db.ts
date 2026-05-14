import { sql } from "@/lib/neon";

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

// ─── Schema init ──────────────────────────────────────────────────────────────

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug        TEXT UNIQUE NOT NULL,
      title       TEXT NOT NULL DEFAULT '',
      summary     TEXT NOT NULL DEFAULT '',
      content     TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      cover_alt   TEXT NOT NULL DEFAULT '',
      tag         TEXT NOT NULL DEFAULT '',
      reading_time INTEGER NOT NULL DEFAULT 1,
      status      TEXT NOT NULL DEFAULT 'draft',
      seo_title   TEXT NOT NULL DEFAULT '',
      seo_description TEXT NOT NULL DEFAULT '',
      og_image    TEXT NOT NULL DEFAULT '',
      author      TEXT NOT NULL DEFAULT 'ORDO',
      published_at TIMESTAMPTZ,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  schemaReady = true;
}

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPost(r: any): DbPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    content: r.content,
    coverImage: r.cover_image,
    coverAlt: r.cover_alt,
    tag: r.tag,
    readingTime: Number(r.reading_time),
    status: r.status as "draft" | "published",
    seoTitle: r.seo_title,
    seoDescription: r.seo_description,
    ogImage: r.og_image,
    author: r.author,
    publishedAt: r.published_at ? new Date(r.published_at).toISOString() : null,
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

// ─── Reads ────────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<DbPost[]> {
  await ensureSchema();
  const rows = await sql`SELECT * FROM posts ORDER BY updated_at DESC`;
  return rows.map(rowToPost);
}

export async function getPublishedPosts(): Promise<DbPost[]> {
  await ensureSchema();
  const rows = await sql`
    SELECT * FROM posts
    WHERE status = 'published'
    ORDER BY COALESCE(published_at, created_at) DESC
  `;
  return rows.map(rowToPost);
}

export async function getPostById(id: string): Promise<DbPost | undefined> {
  await ensureSchema();
  const rows = await sql`SELECT * FROM posts WHERE id = ${id}`;
  return rows[0] ? rowToPost(rows[0]) : undefined;
}

export async function getPostBySlug(slug: string): Promise<DbPost | undefined> {
  await ensureSchema();
  const rows = await sql`
    SELECT * FROM posts WHERE slug = ${slug} AND status = 'published'
  `;
  return rows[0] ? rowToPost(rows[0]) : undefined;
}

export async function getRelatedPosts(slug: string): Promise<DbPost[]> {
  await ensureSchema();
  const post = await getPostBySlug(slug);
  if (!post) return [];
  const rows = await sql`
    SELECT * FROM posts
    WHERE status = 'published' AND slug != ${slug} AND tag = ${post.tag}
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT 2
  `;
  return rows.map(rowToPost);
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createPost(
  data: Omit<DbPost, "id" | "createdAt" | "updatedAt">
): Promise<DbPost> {
  await ensureSchema();
  const rows = await sql`
    INSERT INTO posts (
      slug, title, summary, content, cover_image, cover_alt, tag,
      reading_time, status, seo_title, seo_description, og_image, author, published_at
    ) VALUES (
      ${data.slug}, ${data.title}, ${data.summary}, ${data.content},
      ${data.coverImage}, ${data.coverAlt}, ${data.tag},
      ${data.readingTime}, ${data.status}, ${data.seoTitle},
      ${data.seoDescription}, ${data.ogImage}, ${data.author},
      ${data.publishedAt ?? null}
    )
    RETURNING *
  `;
  return rowToPost(rows[0]);
}

export async function updatePost(
  id: string,
  data: Partial<Omit<DbPost, "id" | "createdAt">>
): Promise<DbPost | null> {
  await ensureSchema();
  const rows = await sql`
    UPDATE posts SET
      slug            = COALESCE(${data.slug ?? null}, slug),
      title           = COALESCE(${data.title ?? null}, title),
      summary         = COALESCE(${data.summary ?? null}, summary),
      content         = COALESCE(${data.content ?? null}, content),
      cover_image     = COALESCE(${data.coverImage ?? null}, cover_image),
      cover_alt       = COALESCE(${data.coverAlt ?? null}, cover_alt),
      tag             = COALESCE(${data.tag ?? null}, tag),
      reading_time    = COALESCE(${data.readingTime ?? null}, reading_time),
      status          = COALESCE(${data.status ?? null}, status),
      seo_title       = COALESCE(${data.seoTitle ?? null}, seo_title),
      seo_description = COALESCE(${data.seoDescription ?? null}, seo_description),
      og_image        = COALESCE(${data.ogImage ?? null}, og_image),
      author          = COALESCE(${data.author ?? null}, author),
      published_at    = COALESCE(${data.publishedAt ?? null}, published_at),
      updated_at      = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? rowToPost(rows[0]) : null;
}

export async function deletePost(id: string): Promise<boolean> {
  await ensureSchema();
  const rows = await sql`DELETE FROM posts WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
