export interface CaseContent {
  eyebrow: string;
  titleLead: string;
  titleHighlight: string;
  subtitle: string;
  sector: string;
  stats: { value: string; label: string }[];
  phasesTitle: string;
  phases: { title: string; text: string }[];
  resultsTitle: string;
  results: { strong: string; rest: string }[];
  compareTitle: string;
  compare: { label: string; value: string; percent: number }[];
  ctaText: string;
  cta: string;
}
