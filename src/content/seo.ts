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

const SEO: Record<string, SeoContent> = { pt };

export function getSeo(locale: string): SeoContent {
  return SEO[locale] ?? pt;
}
