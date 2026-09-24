import CtaLink from "@/components/brand/CtaLink";
import { GridMark } from "@/components/brand/GridMark";
import Reveal from "@/components/brand/Reveal";
import type { HomeContent } from "@/content/home/types";

export default function FinalCta({
  content,
  whatsapp,
}: {
  content: HomeContent["finalCta"];
  whatsapp?: string;
}) {
  return (
    <section aria-labelledby="cta-final-title" className="bg-white py-6">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="on-dark relative overflow-hidden rounded-3xl bg-[#5B2A86] px-6 py-14 text-center sm:px-12 md:py-20">
          <div className="bg-grid-2x2-dark pointer-events-none absolute inset-0" aria-hidden="true" />
          <GridMark
            size={120}
            filled={4}
            tone="dark"
            className="pointer-events-none absolute -right-6 -top-6 opacity-20 sm:right-10 sm:top-10"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2
              id="cta-final-title"
              className="font-heading text-[1.75rem] font-extrabold leading-tight text-white sm:text-4xl"
            >
              {content.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#F3EEF9] sm:text-lg">{content.subtitle}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaLink href="#contato" service="diagnostico" variant="light" className="w-full sm:w-auto">
                {content.cta}
              </CtaLink>
              {whatsapp && (
                <CtaLink
                  href={`https://wa.me/${whatsapp}`}
                  variant="outline-light"
                  arrow={false}
                  external
                  className="w-full sm:w-auto"
                >
                  {content.whatsapp}
                </CtaLink>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
