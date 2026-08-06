import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { getPostBySlug, getBlogPosts, getRelatedPosts } from "@/lib/blog";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

const BASE = "https://ordoconsultoria.com.br";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  const isEn = locale === "en";
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.summary;
  const image = post.ogImage ?? post.coverImage;
  const url = isEn ? `${BASE}/en/blog/${slug}` : `${BASE}/blog/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": `${BASE}/blog/${slug}`,
        en: `${BASE}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.date,
      ...(image ? { images: [{ url: image, alt: post.coverAlt ?? title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export const revalidate = 300;

function formatDate(iso: string, locale: string) {
  const localeCode = locale === "en" ? "en-US" : "pt-BR";
  return new Date(iso).toLocaleDateString(localeCode, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const isEn = locale === "en";
  const postUrl = isEn ? `${BASE}/en/blog/${slug}` : `${BASE}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    datePublished: post.date,
    url: postUrl,
    author: { "@type": "Organization", name: "ORDO Consultoria", url: BASE },
    publisher: {
      "@type": "Organization",
      name: "ORDO Consultoria",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/images/logo.png` },
    },
    ...(post.coverImage ? { image: post.ogImage ?? post.coverImage } : {}),
  };

  const related = await getRelatedPosts(slug);

  return (
    <main className="min-h-screen bg-white pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-10 transition-colors"
          style={{ color: "#4F3DB5" }}
        >
          <ArrowLeft size={15} />
          {t("backToAll")}
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#EEEDFE", color: "#4F3DB5" }}
            >
              <Tag size={10} />
              {post.tag}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {post.readingTime} min
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {post.title}
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-4">{post.summary}</p>
          <p className="text-sm text-gray-400">{formatDate(post.date, locale)}</p>
        </header>

        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.coverAlt ?? post.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {!post.coverImage && <div className="h-px bg-gray-100 mb-10" />}

        <article
          className="prose prose-gray prose-lg max-w-none
            prose-headings:font-extrabold prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-strong:text-gray-800
            prose-a:text-[#4F3DB5] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div
          className="mt-16 rounded-2xl p-8 text-center"
          style={{ backgroundColor: "#EEEDFE" }}
        >
          <h3
            className="text-xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("postCta.title")}
          </h3>
          <p className="text-gray-600 mb-6 text-sm">{t("postCta.body")}</p>
          <Link
            href="/#contato"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#4F3DB5" }}
          >
            {t("postCta.button")}
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h3
              className="text-lg font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Artigos relacionados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group block rounded-xl border border-gray-100 p-5 hover:border-[#AFA9EC] hover:shadow-md transition-all"
                >
                  <span
                    className="text-[0.65rem] font-bold uppercase tracking-wider"
                    style={{ color: "#4F3DB5" }}
                  >
                    {r.tag}
                  </span>
                  <p className="text-sm font-semibold text-gray-800 mt-1 group-hover:text-[#4F3DB5] transition-colors leading-snug">
                    {r.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
