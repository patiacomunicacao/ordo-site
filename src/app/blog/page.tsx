import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getBlogPosts } from "@/lib/blog";
import type { BlogPost } from "@/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos sobre processos, automação e IA para pequenas e médias empresas.",
};

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Processos: { bg: "#EEEDFE", text: "#4F3DB5" },
  Automação: { bg: "#EEEDFE", text: "#3C3489" },
  IA:        { bg: "#EEEDFE", text: "#3C3489" },
};

const ALL_TAGS = ["Todos", "Processos", "Automação", "IA"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function PostCard({ post }: { post: BlogPost }) {
  const tagStyle = TAG_COLORS[post.tag] ?? TAG_COLORS["Processos"];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#AFA9EC] transition-all duration-300"
    >
      {/* Cover image */}
      {post.coverImage ? (
        <div className="h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.coverAlt ?? post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-44" style={{ backgroundColor: "#EEEDFE", opacity: 0.8 }} />
      )}

      <div className="flex flex-col flex-1 p-6">
        <span
          className="self-start text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
          style={{ backgroundColor: tagStyle.bg, color: tagStyle.text }}
        >
          {post.tag}
        </span>

        <h2
          className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#4F3DB5] transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {post.title}
        </h2>

        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-3">
          {post.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
          <span>{formatDate(post.date)}</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readingTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const allPosts = await getBlogPosts();
  const posts =
    !tag || tag === "Todos"
      ? allPosts
      : allPosts.filter((p) => p.tag === tag);

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#4F3DB5" }}
          >
            Conteúdo
          </span>
          <h1
            className="mt-3 text-4xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Blog ORDO
          </h1>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Artigos práticos sobre processos, automação e IA para PMEs.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {ALL_TAGS.map((t) => {
            const active = !tag ? t === "Todos" : t === tag;
            return (
              <Link
                key={t}
                href={t === "Todos" ? "/blog" : `/blog?tag=${t}`}
                className="text-sm font-medium px-4 py-1.5 rounded-full border-2 transition-all duration-200"
                style={{
                  backgroundColor: active ? "#4F3DB5" : "white",
                  borderColor: active ? "#4F3DB5" : "#E5E7EB",
                  color: active ? "white" : "#6B7280",
                }}
              >
                {t}
              </Link>
            );
          })}
        </div>

        {/* Posts grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-16">
            Nenhum artigo encontrado para esta categoria.
          </p>
        )}
      </div>
    </main>
  );
}
