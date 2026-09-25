import { Building2, Check, Scale, type LucideIcon } from "lucide-react";
import CtaLink from "@/components/brand/CtaLink";
import Reveal from "@/components/brand/Reveal";
import SectionHeader from "@/components/brand/SectionHeader";
import type { HomeContent } from "@/content/home/types";

const ICONS: LucideIcon[] = [Building2, Scale];

export default function ForWhom({ content }: { content: HomeContent["forWhom"] }) {
  return (
    <section id="para-quem" aria-labelledby="para-quem-title" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            id="para-quem-title"
            eyebrow={content.eyebrow}
            title={content.title}
            subtitle={content.subtitle}
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 md:gap-8">
          {content.audiences.map((audience, i) => {
            const Icon = ICONS[i] ?? Building2;
            return (
              <Reveal as="li" key={audience.title} delay={i * 100}>
                <article className="flex h-full flex-col rounded-3xl border border-[#E4D8F2] bg-gradient-to-b from-[#F8F5FC] to-white p-6 sm:p-8">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5B2A86] text-white">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <h3 className="font-heading text-xl font-extrabold text-gray-900 sm:text-2xl">
                      {audience.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-gray-600 sm:text-base">
                    {audience.description}
                  </p>
                  <ul className="mt-5 flex-1 space-y-3">
                    {audience.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[15px] text-gray-700">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#F3EEF9] text-[#5B2A86]">
                          <Check size={13} strokeWidth={3} aria-hidden="true" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <CtaLink href="#contato" service="diagnostico" variant="text" className="mt-6 self-start">
                    {audience.cta}
                  </CtaLink>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
