export const revalidate = 300;

import type { Metadata } from "next";

const BASE = "https://ordoconsultoria.com.br";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const url = isEn ? `${BASE}/en` : BASE;
  const title = isEn
    ? "ORDO Consultoria | Process Mapping, Automation & AI for SMBs"
    : "ORDO Consultoria | Processos, Automação e IA para PMEs";
  const description = isEn
    ? "ORDO helps small and medium businesses grow efficiently through process mapping, automation, and artificial intelligence."
    : "A ORDO ajuda pequenas e médias empresas a crescerem com eficiência por meio do mapeamento de processos, automação e inteligência artificial.";

  return {
    alternates: {
      canonical: url,
      languages: { "pt-BR": BASE, en: `${BASE}/en` },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import WhyOrdo from "@/components/sections/WhyOrdo";
import Services from "@/components/sections/Services";
import Methodology from "@/components/sections/Methodology";
import SocialProof from "@/components/sections/SocialProof";
import BlogPreview from "@/components/sections/BlogPreview";
import ContactForm from "@/components/sections/ContactForm";
import ChatWidget from "@/components/chat/ChatWidget";
import { getSiteConfig } from "@/lib/site-config";
import { getBlogPosts } from "@/lib/blog";
import type { BlogPost } from "@/types";

export default async function Home() {
  const [siteConfig, allPosts] = await Promise.all([
    getSiteConfig(),
    getBlogPosts(),
  ]);
  const previewPosts: BlogPost[] = allPosts.slice(0, 3);

  return (
    <>
      <main>
        <Hero />
        <WhyOrdo />
        <Services />
        <Methodology />
        <SocialProof />
        <BlogPreview posts={previewPosts} />
        <ContactForm siteConfig={siteConfig} />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
