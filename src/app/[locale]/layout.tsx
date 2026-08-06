import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import PublicShell from "@/components/layout/PublicShell";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

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

const BASE = "https://ordoautomacao.com.br";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "ORDO Consultoria | Process Mapping, Automation & AI for SMBs"
    : "ORDO Consultoria | Processos, Automação e IA para PMEs";
  const description = isEn
    ? "ORDO helps small and medium businesses grow efficiently through process mapping, automation, and artificial intelligence."
    : "A ORDO ajuda pequenas e médias empresas a crescerem com eficiência por meio do mapeamento de processos, automação e inteligência artificial.";

  return {
    metadataBase: new URL(BASE),
    title: { default: title, template: "%s | ORDO Consultoria" },
    description,
    authors: [{ name: "ORDO Consultoria" }],
    creator: "ORDO Consultoria",
    openGraph: {
      type: "website",
      siteName: "ORDO Consultoria",
      locale: isEn ? "en_US" : "pt_BR",
    },
    twitter: { card: "summary_large_image" },
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
              "@type": "Organization",
              name: "ORDO Consultoria",
              url: BASE,
              logo: `${BASE}/images/logo.png`,
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
        {CLARITY_ID && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${CLARITY_ID}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
