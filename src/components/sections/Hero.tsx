import { Check } from "lucide-react";
import CtaLink from "@/components/brand/CtaLink";
import { Eyebrow } from "@/components/brand/GridMark";
import Illustration from "@/components/illustrations/Illustration";
import type { HomeContent } from "@/content/home/types";

export default function Hero({ content }: { content: HomeContent["hero"] }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-[#F8F5FC] pt-24 md:pt-28"
    >
      <div className="bg-grid-2x2 pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-[#EADFF6] opacity-70 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 md:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8 lg:pt-10">
        <div>
          <div className="hero-enter">
            <Eyebrow>{content.eyebrow}</Eyebrow>
          </div>

          <h1
            id="hero-title"
            className="mt-5 font-heading text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.4rem]"
          >
            {content.titleLead}{" "}
            <span className="text-[#5B2A86]">{content.titleHighlight}</span>
          </h1>

          <p
            className="hero-enter mt-5 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl"
            style={{ animationDelay: "0.1s" }}
          >
            {content.subtitle}
          </p>

          <div
            className="hero-enter mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.2s" }}
          >
            <CtaLink href="#contato" service="diagnostico">
              {content.ctaPrimary}
            </CtaLink>
            <CtaLink href="#servicos" variant="outline" arrow={false}>
              {content.ctaSecondary}
            </CtaLink>
          </div>

          <ul
            className="hero-enter mt-8 grid gap-2.5 text-sm text-gray-700 sm:grid-cols-3 sm:gap-4"
            style={{ animationDelay: "0.3s" }}
          >
            {content.points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#5B2A86] text-white">
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="hero-enter mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none"
          style={{ animationDelay: "0.25s" }}
        >
          <Illustration name="hero" alt={content.illustrationAlt} preload />
        </div>
      </div>
    </section>
  );
}
