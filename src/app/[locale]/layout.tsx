import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import PublicShell from "@/components/layout/PublicShell";
import CookieBanner from "@/components/layout/CookieBanner";
import ConsentScripts from "@/components/layout/ConsentScripts";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getSeo, BASE_URL } from "@/content/seo";
import { DEFAULT_SITE_CONFIG } from "@/lib/site-config";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const BASE = BASE_URL;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = getSeo(locale);

  return {
    metadataBase: new URL(BASE),
    title: { default: seo.title, template: `%s | ${seo.siteName}` },
    description: seo.description,
    authors: [{ name: seo.siteName }],
    creator: seo.siteName,
    openGraph: {
      type: "website",
      siteName: seo.siteName,
      locale: locale === "en" ? "en_US" : "pt_BR",
      images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.ogImageAlt }],
    },
    twitter: { card: "summary_large_image", images: [seo.ogImage] },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "pt" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      className={`${outfit.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "ORDO Automação",
              url: BASE,
              logo: `${BASE}/images/logo-ordo-color.png`,
              description: getSeo(locale).description,
              sameAs: [DEFAULT_SITE_CONFIG.instagram],
              areaServed: "BR",
              knowsAbout: [
                "Mapeamento de processos",
                "Automação de processos",
                "Agentes de IA",
                "Consultoria operacional",
                "Sistemas embarcados",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                areaServed: "BR",
                availableLanguage: ["Portuguese", "English"],
              },
            }),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <PublicShell>{children}</PublicShell>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
        {GA_ID && (
          <>
            {/* Consent Mode v2 — bloqueia cookies até o usuário aceitar */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                    analytics_storage: 'denied',
                    ad_storage: 'denied',
                  });
                `,
              }}
            />
            <Script
              id="ga4-gtag"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-config" strategy="afterInteractive">
              {`gtag('js', new Date()); gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        <ConsentScripts clarityId={CLARITY_ID} gaId={GA_ID} />
        <CookieBanner locale={locale} />
      </body>
    </html>
  );
}
