import { cn } from "@/lib/utils";
import { Eyebrow } from "./GridMark";

export default function SectionHeader({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  className,
}: {
  /** id do h2, para `aria-labelledby` da seção */
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn(
          "mt-4 font-heading text-[1.75rem] font-extrabold leading-tight tracking-tight sm:text-4xl",
          tone === "light" ? "text-gray-900" : "text-white"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "light" ? "text-gray-600" : "text-[#E9DDF7]/80"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
