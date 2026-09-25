export const revalidate = 300;

import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import HowWeWork from "@/components/sections/HowWeWork";
import ForWhom from "@/components/sections/ForWhom";
import CaseHighlight from "@/components/sections/CaseHighlight";
import BlogPreview from "@/components/sections/BlogPreview";
import FinalCta from "@/components/sections/FinalCta";
import ContactForm from "@/components/sections/ContactForm";
import ChatWidget from "@/components/chat/ChatWidget";
import { getSiteConfig } from "@/lib/site-config";
import { getBlogPosts } from "@/lib/blog";
import { getHomeContent } from "@/content/home";
import { getSeo, BASE_URL } from "@/content/seo";
import type { BlogPost } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = getSeo(locale);
  const url = locale === "en" ? `${BASE_URL}/en` : BASE_URL;

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: url,
      languages: { "pt-BR": BASE_URL, en: `${BASE_URL}/en` },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      type: "website",
      images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = getHomeContent(locale);
  const [siteConfig, allPosts] = await Promise.all([
    getSiteConfig(),
    getBlogPosts(),
  ]);
  const previewPosts: BlogPost[] = allPosts.slice(0, 3);

  return (
    <>
      <main id="conteudo">
        <Hero content={content.hero} />
        <Services content={content.services} />
        <HowWeWork content={content.howWeWork} />
        <ForWhom content={content.forWhom} />
        <CaseHighlight content={content.caseHighlight} />
        <BlogPreview posts={previewPosts} />
        <FinalCta content={content.finalCta} whatsapp={siteConfig.whatsapp} />
        <ContactForm siteConfig={siteConfig} content={content.contact} />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
