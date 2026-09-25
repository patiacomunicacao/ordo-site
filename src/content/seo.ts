export const BASE_URL = "https://ordoautomacao.com.br";

export interface SeoContent {
  siteName: string;
  title: string;
  description: string;
  ogImage: string;
  ogImageAlt: string;
}

const pt: SeoContent = {
  siteName: "ORDO Automação",
  title: "ORDO Automação | Diagnóstico de processos, automação e IA para empresas",
  description:
    "Diagnóstico de processos, automação, agentes de IA, consultoria recorrente e sistemas embarcados para PMEs e escritórios de advocacia. Agende seu diagnóstico.",
  ogImage: "/api/og/pt",
  ogImageAlt: "ORDO Automação: sua operação organizada, automatizada e pronta para crescer.",
};

const en: SeoContent = {
  siteName: "ORDO Automação",
  title: "ORDO Automação | Process assessment, automation and AI for businesses",
  description:
    "Process assessment, automation, AI agents, ongoing consulting and embedded systems for SMBs and law firms. Book your assessment.",
  ogImage: "/api/og/en",
  ogImageAlt: "ORDO Automação: your operation organized, automated and ready to grow.",
};

const SEO: Record<string, SeoContent> = { pt, en };

export function getSeo(locale: string): SeoContent {
  return SEO[locale] ?? pt;
}
