/**
 * Conteúdo da página inicial (V2), separado por idioma.
 * `pt.ts` é a fonte principal; `en.ts` segue a mesma estrutura.
 */

export type ServiceId =
  | "diagnostico"
  | "diagnostico-simples"
  | "diagnostico-completo"
  | "implementacao-processos"
  | "automacao-starter"
  | "automacao-pro"
  | "agentes-ia"
  | "sistemas-ia"
  | "consultoria-essential"
  | "consultoria-advanced"
  | "consultoria-partner"
  | "sistemas-embarcados";

export interface ServiceItem {
  id: ServiceId;
  title: string;
  description: string;
  cta: string;
}

export interface ServiceFamily {
  /** âncora usada no índice das famílias (ex.: "servicos-diagnostico") */
  anchor: string;
  number: string;
  title: string;
  tagline: string;
  items: ServiceItem[];
}

export interface ConsultingPlan {
  id: ServiceId;
  name: string;
  summary: string;
  features: string[];
  /** profundidade de atuação, de 1 a 4 (quadrados preenchidos do grid 2×2) */
  depth: 1 | 2 | 3 | 4;
  highlight?: boolean;
  badge?: string;
  cta: string;
}

export interface HomeContent {
  hero: {
    eyebrow: string;
    titleLead: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    points: string[];
    illustrationAlt: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    indexLabel: string;
    diagnosis: ServiceFamily;
    implementation: ServiceFamily;
    ai: ServiceFamily;
    consulting: Omit<ServiceFamily, "items"> & {
      depthLabel: string;
      /** rótulos por profundidade: índice 0 = nível 1 */
      depthLevels: string[];
      plans: ConsultingPlan[];
    };
    embedded: {
      anchor: string;
      number: string;
      eyebrow: string;
      title: string;
      tagline: string;
      description: string;
      features: { title: string; description: string }[];
      cta: string;
      illustrationAlt: string;
    };
  };
  howWeWork: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stepLabel: string;
    steps: { title: string; description: string }[];
  };
  forWhom: {
    eyebrow: string;
    title: string;
    subtitle: string;
    audiences: { title: string; description: string; points: string[]; cta: string }[];
  };
  caseHighlight: {
    eyebrow: string;
    title: string;
    description: string;
    sector: string;
    stats: { value: string; label: string }[];
    cta: string;
  };
  finalCta: {
    title: string;
    subtitle: string;
    cta: string;
    whatsapp: string;
  };
  contact: {
    serviceOptions: { value: ServiceId | "outro"; label: string }[];
    instagramLabel: string;
  };
}
