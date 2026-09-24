import type { HomeContent } from "./types";
import { pt } from "./pt";

const CONTENT: Record<string, HomeContent> = { pt };

export function getHomeContent(locale: string): HomeContent {
  return CONTENT[locale] ?? pt;
}

export type { HomeContent } from "./types";
