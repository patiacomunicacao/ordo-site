// Home page — importa e compõe todas as seções da landing page
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

export default async function Home() {
  const siteConfig = await getSiteConfig();
  return (
    <>
      <main>
        <Hero />
        <WhyOrdo />
        <Services />
        <Methodology />
        <SocialProof />
        <BlogPreview />
        <ContactForm siteConfig={siteConfig} />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
