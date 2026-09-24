import { Check } from "lucide-react";
import CtaLink from "@/components/brand/CtaLink";
import { Eyebrow, GridMark } from "@/components/brand/GridMark";
import Reveal from "@/components/brand/Reveal";
import type { CaseContent } from "@/content/case/types";

export default function CaseClickUp({
  content,
  contactHref,
}: {
  content: CaseContent;
  contactHref: string;
}) {
  return (
    <section aria-labelledby="case-clickup-title" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2
            id="case-clickup-title"
            className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl"
          >
            {content.titleLead}
            <br />
            <span className="text-[#5B2A86]">{content.titleHighlight}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">{content.subtitle}</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E4D8F2] bg-[#F8F5FC] px-4 py-1.5 text-sm text-gray-700">
            <GridMark size={12} filled={1} />
            {content.sector}
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {content.stats.map((stat, i) => (
            <Reveal as="li" key={stat.label} delay={i * 80}>
              <div className="h-full rounded-2xl border border-[#E4D8F2] bg-white p-6 sm:p-7">
                <p className="font-heading text-4xl font-extrabold text-[#5B2A86] sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm leading-snug text-gray-600">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <h3 className="font-heading text-xl font-extrabold text-gray-900">{content.phasesTitle}</h3>
            <ol className="mt-6 space-y-6">
              {content.phases.map((phase, i) => (
                <li key={phase.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EEF9] font-heading text-sm font-bold text-[#5B2A86]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-heading font-bold text-gray-900">{phase.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-gray-600">{phase.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-3xl bg-[#F8F5FC] p-6 sm:p-8">
              <h3 className="font-heading text-xl font-extrabold text-gray-900">{content.resultsTitle}</h3>
              <ul className="mt-6 divide-y divide-[#E4D8F2]">
                {content.results.map((r) => (
                  <li key={r.strong} className="flex items-start gap-3 py-3.5 text-[15px] text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#5B2A86] text-white">
                      <Check size={13} strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span>
                      <strong className="font-semibold text-gray-900">{r.strong}</strong> {r.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <div className="rounded-3xl border border-[#E4D8F2] p-6 sm:p-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-600">{content.compareTitle}</h3>
            <dl className="mt-5 space-y-4">
              {content.compare.map((row, i) => (
                <div key={row.label} className="grid grid-cols-[5.5rem_1fr_4rem] items-center gap-3 sm:grid-cols-[7rem_1fr_5rem]">
                  <dt className="text-right text-sm font-medium text-gray-600">{row.label}</dt>
                  <dd className="h-2.5 overflow-hidden rounded-full bg-[#F3EEF9]">
                    <span
                      className="block h-full min-w-2.5 rounded-full"
                      style={{
                        width: `${row.percent}%`,
                        backgroundColor: i === 0 ? "#C9B3E6" : "#5B2A86",
                      }}
                    />
                  </dd>
                  <dd className="font-heading text-sm font-bold text-[#3E1C5E]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <p className="text-base text-gray-600">{content.ctaText}</p>
          <CtaLink href={contactHref}>
            {content.cta}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
