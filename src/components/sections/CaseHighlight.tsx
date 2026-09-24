import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/brand/GridMark";
import Reveal from "@/components/brand/Reveal";
import type { HomeContent } from "@/content/home/types";

export default function CaseHighlight({ content }: { content: HomeContent["caseHighlight"] }) {
  return (
    <section aria-labelledby="case-title" className="bg-white pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-8 rounded-3xl border border-[#E4D8F2] bg-[#F8F5FC] p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <Eyebrow>{content.eyebrow}</Eyebrow>
              <h2
                id="case-title"
                className="mt-4 font-heading text-[1.75rem] font-extrabold leading-tight text-gray-900 sm:text-4xl"
              >
                {content.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">{content.description}</p>
              <p className="mt-3 text-sm text-gray-600">{content.sector}</p>
              <Link
                href="/casos"
                className="group mt-6 inline-flex min-h-12 items-center gap-2 font-semibold text-[#5B2A86] underline-offset-4 hover:underline"
              >
                {content.cta}
                <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3">
              {content.stats.map((stat) => (
                <li key={stat.label} className="rounded-2xl bg-white p-5 ring-1 ring-[#E4D8F2]">
                  <p className="font-heading text-3xl font-extrabold text-[#5B2A86] sm:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-sm leading-snug text-gray-600">{stat.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
