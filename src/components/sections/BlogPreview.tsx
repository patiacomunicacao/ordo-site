"use client";

import { Link } from "@/i18n/navigation";
import Reveal from "@/components/brand/Reveal";
import { Eyebrow } from "@/components/brand/GridMark";
import { ArrowRight, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { useTranslations, useLocale } from "next-intl";

const TAG_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  Processos: { bg: "#5B2A86", text: "#5B2A86", accent: "#F3EEF9" },
  "Automação": { bg: "#C9B3E6", text: "#3E1C5E", accent: "#F3EEF9" },
  IA: { bg: "#3E1C5E", text: "#3E1C5E", accent: "#F3EEF9" },
};

function PlaceholderImage({ tag }: { tag: string }) {
  const color = TAG_COLORS[tag]?.bg ?? "#5B2A86";
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <rect width="400" height="200" fill={color} opacity="0.12" />
      <circle cx="80" cy="60" r="55" fill={color} opacity="0.15" />
      <circle cx="320" cy="150" r="70" fill={color} opacity="0.12" />
      <rect x="140" y="30" width="120" height="4" rx="2" fill={color} opacity="0.2" />
      <rect x="100" y="50" width="200" height="4" rx="2" fill={color} opacity="0.15" />
    </svg>
  );
}

function BlogCard({ post, locale }: { post: BlogPost; locale: string }) {
  const tagStyle = TAG_COLORS[post.tag] ?? TAG_COLORS["Processos"];
  const localeCode = locale === "en" ? "en-US" : "pt-BR";
  const formattedDate = new Date(post.date).toLocaleDateString(localeCode, {
    day: "2-digit", month: "short", year: "numeric",
  });
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-[#E4D8F2] overflow-hidden hover:shadow-lg hover:border-[#C9B3E6] transition-all duration-300"
    >
      <div className="h-44 overflow-hidden bg-gray-50">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.coverAlt ?? post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <PlaceholderImage tag={post.tag} />
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <span
          className="self-start text-[0.65rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
          style={{ backgroundColor: tagStyle.accent, color: tagStyle.text }}
        >
          {post.tag}
        </span>
        <h3
          className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#5B2A86] transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4 line-clamp-3">
          {post.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <span>{formattedDate}</span>
          <span className="flex items-center gap-1">
            <Clock size={11} aria-hidden="true" />
            {post.readingTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("blogPreview");
  const locale = useLocale();
  if (posts.length === 0) return null;

  return (
    <section id="blog" aria-labelledby="blog-title" className="pt-4 pb-20 md:pb-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2
              id="blog-title"
              className="mt-4 font-heading text-[1.75rem] sm:text-4xl font-extrabold text-gray-900"
            >
              {t("title")}
            </h2>
          </div>
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-[#5B2A86] text-[#5B2A86] hover:bg-[#F3EEF9] flex-shrink-0 font-semibold"
            )}
          >
            {t("viewAll")}
            <ArrowRight size={15} className="ml-1.5" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 100}>
              <BlogCard post={post} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
