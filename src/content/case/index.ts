import type { CaseContent } from "./types";
import { casePt } from "./pt";
import { caseEn } from "./en";

const CONTENT: Record<string, CaseContent> = { pt: casePt, en: caseEn };

export function getCaseContent(locale: string): CaseContent {
  return CONTENT[locale] ?? casePt;
}
