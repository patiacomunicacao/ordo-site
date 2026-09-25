export type { ChatMessage } from "./chat";

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
