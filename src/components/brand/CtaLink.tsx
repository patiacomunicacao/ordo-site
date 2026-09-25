import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceId } from "@/content/home/types";

const VARIANTS = {
  primary:
    "bg-[#5B2A86] text-white hover:bg-[#4A2270] shadow-[0_8px_24px_-10px_rgba(91,42,134,0.7)]",
  outline:
    "border-2 border-[#5B2A86] text-[#5B2A86] bg-white/70 hover:bg-[#F3EEF9]",
  light: "bg-white text-[#3E1C5E] hover:bg-[#F3EEF9]",
  "outline-light": "border-2 border-white/40 text-white hover:bg-white/10",
  text: "text-[#5B2A86] hover:text-[#3E1C5E] px-0 min-h-0 underline-offset-4 hover:underline",
} as const;

/**
 * Link de chamada para ação. Com `service`, pré-seleciona o serviço no
 * formulário de contato (ver ContactForm).
 */
export default function CtaLink({
  href,
  children,
  variant = "primary",
  service,
  arrow = true,
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  service?: ServiceId;
  arrow?: boolean;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      data-service={service}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition-colors duration-200",
        VARIANTS[variant],
        className
      )}
    >
      {children}
      {arrow && (
        <ArrowRight
          size={17}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      )}
    </a>
  );
}
