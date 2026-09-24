import type { HomeContent } from "./types";
import { pt } from "./pt";
import { en } from "./en";

const CONTENT: Record<string, HomeContent> = { pt, en };

export function getHomeContent(locale: string): HomeContent {
  return CONTENT[locale] ?? pt;
}

export type { HomeContent } from "./types";
