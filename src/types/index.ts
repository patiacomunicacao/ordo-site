export type { ChatMessage } from "./chat";

export interface Service {
  id: string;
  icon: string;        // nome do ícone lucide-react (ex: "GitBranch")
  title: string;
  description: string;
  priceFrom: number;   // em reais
  slug: string;
  bullets?: string[];
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  date: string;          // ISO 8601 (ex: "2025-03-15")
  tag: string;           // ex: "Automação", "Processos", "IA"
  readingTime: number;   // minutos
  content: string;       // HTML
  // CMS fields (optional for backward compat)
  coverImage?: string;
  coverAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  author?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  initials: string;
}

export interface MethodologyStep {
  number: string;      // "01", "02"…
  icon: string;        // nome do ícone lucide-react
  title: string;
  description: string;
}
