import type { CaseContent } from "./types";
import { casePt } from "./pt";

const CONTENT: Record<string, CaseContent> = { pt: casePt };

export function getCaseContent(locale: string): CaseContent {
  return CONTENT[locale] ?? casePt;
}
