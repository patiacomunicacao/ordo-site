import {
  Check,
  Cpu,
  Database,
  DatabaseZap,
  FileStack,
  Gauge,
  Globe,
  MessagesSquare,
  Network,
  SearchCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import CtaLink from "@/components/brand/CtaLink";
import { Eyebrow, GridMark } from "@/components/brand/GridMark";
import Reveal from "@/components/brand/Reveal";
import SectionHeader from "@/components/brand/SectionHeader";
import Illustration from "@/components/illustrations/Illustration";
import { cn } from "@/lib/utils";
import type {
  ConsultingPlan,
  HomeContent,
  ServiceFamily,
  ServiceId,
  ServiceItem,
} from "@/content/home/types";

const ICONS: Partial<Record<ServiceId, LucideIcon>> = {
  "diagnostico-simples": SearchCheck,
  "diagnostico-completo": FileStack,
  "implementacao-processos": Users,
  "automacao-starter": Zap,
  "automacao-pro": Network,
  "agentes-ia": MessagesSquare,
  "sistemas-ia": DatabaseZap,
};

const EMBEDDED_ICONS: LucideIcon[] = [Database, Gauge, Globe];

function FamilyHeader({
  number,
  title,
  tagline,
  highlight,
}: {
  number: string;
  title: string;
  tagline: string;
  highlight: 1 | 2 | 3 | 4;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F3EEF9]">
        <GridMark size={26} filled={highlight} />
      </div>
      <div>
        <p className="font-heading text-sm font-bold text-[#5B2A86]">{number}</p>
        <h3 className="font-heading text-xl font-extrabold leading-tight text-gray-900 sm:text-2xl">
          {title}
        </h3>
        <p className="text-sm text-gray-600 sm:text-base">{tagline}</p>
      </div>
    </div>
  );
}

function ServiceCard({ item }: { item: ServiceItem }) {
  const Icon = ICONS[item.id];
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#E4D8F2] bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#5B2A86] hover:shadow-[0_18px_40px_-24px_rgba(91,42,134,0.55)] sm:p-7">
      {Icon && (
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3EEF9] text-[#5B2A86] transition-colors duration-300 group-hover:bg-[#5B2A86] group-hover:text-white">
          <Icon size={22} aria-hidden="true" />
        </div>
      )}
      <h4 className="font-heading text-lg font-bold text-gray-900">{item.title}</h4>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-gray-600">{item.description}</p>
      <CtaLink href="#contato" service={item.id} variant="text" className="mt-5 self-start">
        {item.cta}
        <span className="sr-only">: {item.title}</span>
      </CtaLink>
    </article>
  );
}

function Family({
  family,
  highlight,
  columns,
}: {
  family: ServiceFamily;
  highlight: 1 | 2 | 3 | 4;
  columns: 2 | 3;
}) {
  return (
    <div id={family.anchor} className="pt-14 first:pt-0 md:pt-20">
      <Reveal>
        <FamilyHeader
          number={family.number}
          title={family.title}
          tagline={family.tagline}
          highlight={highlight}
        />
      </Reveal>
      <ul
        className={cn(
          "mt-8 grid gap-4 sm:gap-6",
          columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {family.items.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 80}>
            <ServiceCard item={item} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function DepthMeter({
  depth,
  label,
  levelLabel,
  dark,
}: {
  depth: ConsultingPlan["depth"];
  label: string;
  levelLabel: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3",
        dark ? "bg-white/10" : "bg-[#F3EEF9]"
      )}
    >
      <GridMark size={28} filled={depth} tone={dark ? "dark" : "light"} />
      <div className="leading-tight">
        <p className={cn("text-xs", dark ? "text-[#E9DDF7]/80" : "text-gray-600")}>{label}</p>
        <p className={cn("text-sm font-bold", dark ? "text-white" : "text-[#3E1C5E]")}>
          {levelLabel}
          <span className="sr-only"> ({depth}/4)</span>
        </p>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  depthLabel,
  levelLabel,
}: {
  plan: ConsultingPlan;
  depthLabel: string;
  levelLabel: string;
}) {
  const dark = !!plan.highlight;
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-3xl p-6 sm:p-8",
        dark
          ? "on-dark bg-[#3E1C5E] text-white shadow-[0_30px_60px_-30px_rgba(62,28,94,0.8)] ring-4 ring-[#E3AE4A]/40"
          : "border border-[#E4D8F2] bg-white"
      )}
    >
      {dark && (
        <div className="bg-grid-2x2-dark pointer-events-none absolute inset-0 rounded-3xl" aria-hidden="true" />
      )}
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <h4 className={cn("font-heading text-2xl font-extrabold", dark ? "text-white" : "text-gray-900")}>
            {plan.name}
          </h4>
          {plan.badge && (
            <span className="rounded-full bg-[#E3AE4A] px-3 py-1 text-xs font-bold text-[#2A1540]">
              {plan.badge}
            </span>
          )}
        </div>
        <p className={cn("mt-2 text-[15px]", dark ? "text-[#E9DDF7]" : "text-gray-600")}>{plan.summary}</p>

        <div className="mt-5">
          <DepthMeter depth={plan.depth} label={depthLabel} levelLabel={levelLabel} dark={dark} />
        </div>

        <ul className="mt-6 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-[15px]">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
                  dark ? "bg-[#E9DDF7] text-[#3E1C5E]" : "bg-[#F3EEF9] text-[#5B2A86]"
                )}
              >
                <Check size={13} strokeWidth={3} aria-hidden="true" />
              </span>
              <span className={dark ? "text-white" : "text-gray-700"}>{feature}</span>
            </li>
          ))}
        </ul>

        <CtaLink
          href="#contato"
          service={plan.id}
          variant={dark ? "light" : "outline"}
          className="mt-8 w-full"
        >
          {plan.cta}
          <span className="sr-only">: {plan.name}</span>
        </CtaLink>
      </div>
    </article>
  );
}

export default function Services({ content }: { content: HomeContent["services"] }) {
  const { diagnosis, implementation, ai, consulting, embedded } = content;
  const index = [diagnosis, implementation, ai, consulting, embedded];

  return (
    <section id="servicos" aria-labelledby="servicos-title" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            id="servicos-title"
            eyebrow={content.eyebrow}
            title={content.title}
            subtitle={content.subtitle}
          />
        </Reveal>

        <nav aria-label={content.indexLabel} className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <ul className="flex w-max gap-2 sm:mx-auto sm:flex-wrap sm:justify-center">
            {index.map((f) => (
              <li key={f.anchor}>
                <a
                  href={`#${f.anchor}`}
                  className="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border border-[#E4D8F2] bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:border-[#5B2A86] hover:text-[#5B2A86]"
                >
                  <span className="font-heading font-bold text-[#5B2A86]">{f.number}</span>
                  {f.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-14 md:mt-20">
          <Family family={diagnosis} highlight={1} columns={2} />
          <Family family={implementation} highlight={2} columns={3} />
          <Family family={ai} highlight={3} columns={2} />

          {/* Consultoria recorrente: comparativo por profundidade */}
          <div id={consulting.anchor} className="pt-14 md:pt-20">
            <Reveal>
              <FamilyHeader
                number={consulting.number}
                title={consulting.title}
                tagline={consulting.tagline}
                highlight={4}
              />
            </Reveal>
            <ul className="mt-8 grid items-stretch gap-4 sm:gap-6 lg:mt-10 lg:grid-cols-3">
              {consulting.plans.map((plan, i) => (
                <Reveal as="li" key={plan.id} delay={i * 80}>
                  <PlanCard
                    plan={plan}
                    depthLabel={consulting.depthLabel}
                    levelLabel={consulting.depthLevels[plan.depth - 1]}
                  />
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        {/* Sistemas Embarcados: bloco de destaque */}
        <div id={embedded.anchor} className="pt-16 md:pt-24">
          <Reveal>
            <div className="on-dark relative overflow-hidden rounded-3xl bg-[#1E1030] px-6 py-10 sm:px-10 md:py-14 lg:px-14">
              <div className="bg-grid-2x2-dark pointer-events-none absolute inset-0" aria-hidden="true" />
              <div
                className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#5B2A86] opacity-40 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <Eyebrow tone="dark">{embedded.eyebrow}</Eyebrow>
                  <p className="mt-5 font-heading text-sm font-bold text-[#C9B3E6]">{embedded.number}</p>
                  <h3 className="font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                    {embedded.title}
                  </h3>
                  <p className="mt-1 text-lg font-medium text-[#E9DDF7]">{embedded.tagline}</p>
                  <p className="mt-5 text-base leading-relaxed text-[#E9DDF7]/85">{embedded.description}</p>

                  <ul className="mt-8 space-y-4">
                    {embedded.features.map((feature, i) => {
                      const Icon = EMBEDDED_ICONS[i] ?? Cpu;
                      return (
                        <li key={feature.title} className="flex items-start gap-4">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E9DDF7]">
                            <Icon size={20} aria-hidden="true" />
                          </span>
                          <div>
                            <p className="font-semibold text-white">{feature.title}</p>
                            <p className="text-sm text-[#E9DDF7]/80">{feature.description}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <CtaLink
                    href="#contato"
                    service="sistemas-embarcados"
                    variant="light"
                    className="mt-9 w-full sm:w-auto"
                  >
                    {embedded.cta}
                  </CtaLink>
                </div>
                <div className="mx-auto w-full max-w-lg">
                  <Illustration name="embedded" alt={embedded.illustrationAlt} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
