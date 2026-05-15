// Home page — importa e compõe todas as seções da landing page
export const dynamic = "force-dynamic";

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
