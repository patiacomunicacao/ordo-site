"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";

const TAG_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  Processos: { bg: "#4F3DB5", text: "#4F3DB5", accent: "#EEEDFE" },
  Automação: { bg: "#AFA9EC", text: "#3C3489", accent: "#EEEDFE" },
  IA: { bg: "#3C3489", text: "#3C3489", accent: "#EEEDFE" },
};

function PostPlaceholderImage({ tag }: { tag: string }) {
  const color = TAG_COLORS[tag]?.bg ?? "#4F3DB5";
  return (
    <svg
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <rect width="400" height="200" fill={color} opacity="0.12" />
      <circle cx="80" cy="60" r="55" fill={color} opacity="0.15" />
      <circle cx="320" cy="150" r="70" fill={color} opacity="0.12" />
      <rect x="140" y="30" width="120" height="4" rx="2" fill={color} opacity="0.2" />
      <rect x="100" y="50" width="200" height="4" rx="2" fill={color} opacity="0.15" />
      <rect x="160" y="70" width="80" height="4" rx="2" fill={color} opacity="0.1" />
      <polygon points="180,100 220,140 140,140" fill={color} opacity="0.08" />
    </svg>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function BlogCard({ post }: { post: BlogPost }) {
  const tagStyle = TAG_COLORS[post.tag] ?? TAG_COLORS["Processos"];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#AFA9EC] transition-all duration-300"
    >
      {/* Image placeholder */}
      <div className="h-44 overflow-hidden bg-gray-50">
        <PostPlaceholderImage tag={post.tag} />
      </div>

      <div className="flex flex-col flex-1 p-6">
        {/* Tag */}
        <span
          className="self-start text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
          style={{ backgroundColor: tagStyle.accent, color: tagStyle.text }}
        >
          {post.tag}
        </span>

        <h3
          className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#4F3DB5] transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {post.title}
        </h3>

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

export default function BlogPreview() {
  const posts = BLOG_POSTS.slice(0, 3);

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#4F3DB5" }}
            >
              Conteúdo
            </span>
            <h2
              className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Do nosso blog
            </h2>
          </div>
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-[#4F3DB5] text-[#4F3DB5] hover:bg-[#EEEDFE] flex-shrink-0 font-semibold"
            )}
          >
            Ver todos os artigos
            <ArrowRight size={15} className="ml-1.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
