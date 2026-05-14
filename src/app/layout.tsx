import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/layout/PublicShell";

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

export const metadata: Metadata = {
  title: {
    default: "ORDO Consultoria | Processos, Automação e IA para PMEs",
    template: "%s | ORDO Consultoria",
  },
  description:
    "A ORDO ajuda pequenas e médias empresas a crescerem com eficiência por meio do mapeamento de processos, automação e inteligência artificial.",
  keywords: [
    "consultoria",
    "automação",
    "inteligência artificial",
    "processos",
    "PME",
    "pequenas empresas",
    "médias empresas",
    "BPM",
    "transformação digital",
  ],
  authors: [{ name: "ORDO Consultoria" }],
  creator: "ORDO Consultoria",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ordoconsultoria.com.br",
    siteName: "ORDO Consultoria",
    title: "ORDO Consultoria | Processos, Automação e IA para PMEs",
    description:
      "A ORDO ajuda pequenas e médias empresas a crescerem com eficiência por meio do mapeamento de processos, automação e inteligência artificial.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORDO Consultoria | Processos, Automação e IA para PMEs",
    description:
      "A ORDO ajuda pequenas e médias empresas a crescerem com eficiência por meio do mapeamento de processos, automação e inteligência artificial.",
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
