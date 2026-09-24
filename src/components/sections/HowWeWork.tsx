import { GridMark } from "@/components/brand/GridMark";
import Reveal from "@/components/brand/Reveal";
import SectionHeader from "@/components/brand/SectionHeader";
import type { HomeContent } from "@/content/home/types";

const FILL = [1, 2, 4] as const;

export default function HowWeWork({ content }: { content: HomeContent["howWeWork"] }) {
  return (
    <section
      id="como-trabalhamos"
      aria-labelledby="como-trabalhamos-title"
      className="relative overflow-hidden bg-[#F8F5FC] py-20 md:py-28"
    >
      <div className="bg-grid-2x2 pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            id="como-trabalhamos-title"
            eyebrow={content.eyebrow}
            title={content.title}
            subtitle={content.subtitle}
          />
        </Reveal>

        <ol className="relative mt-14 grid gap-5 md:grid-cols-3 md:gap-8">
          {/* linha que conecta os passos */}
          <span
            className="absolute left-[3.75rem] top-[3.75rem] hidden h-0.5 w-[calc(100%-7.5rem)] bg-gradient-to-r from-[#5B2A86] via-[#C9B3E6] to-[#5B2A86] md:block"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-8 left-12 top-8 w-0.5 bg-[#E4D8F2] md:hidden"
            aria-hidden="true"
          />
          {content.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 120} className="relative">
              <div className="flex h-full gap-5 rounded-2xl border border-[#E4D8F2] bg-white p-6 md:flex-col md:gap-0 md:p-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-[#E4D8F2] md:h-16 md:w-16 md:rounded-2xl">
                  <GridMark size={30} filled={FILL[i] ?? 4} />
                </div>
                <div className="md:mt-6">
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-[#5B2A86]">
                    {content.stepLabel} {i + 1}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-extrabold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
