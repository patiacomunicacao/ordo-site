import { cn } from "@/lib/utils";

/**
 * Motivo gráfico da marca: o grid 2×2 do logo ORDO.
 * `filled` define quantos quadrados ficam sólidos (ordem: ↖ ↗ ↙ ↘).
 */
export function GridMark({
  size = 24,
  filled = 4,
  tone = "light",
  className,
}: {
  size?: number;
  filled?: 0 | 1 | 2 | 3 | 4;
  tone?: "light" | "dark";
  className?: string;
}) {
  const solid = tone === "light" ? "#5B2A86" : "#E9DDF7";
  const soft = tone === "light" ? "#D9C8EE" : "rgba(233,221,247,0.28)";
  const cells = [
    { x: 0, y: 0 },
    { x: 13, y: 0 },
    { x: 0, y: 13 },
    { x: 13, y: 13 },
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width="11"
          height="11"
          rx="2.5"
          fill={i < filled ? solid : soft}
        />
      ))}
    </svg>
  );
}

/** Divisor horizontal com o grid 2×2 no centro. */
export function GridDivider({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const line = tone === "light" ? "bg-[#E4D8F2]" : "bg-white/15";
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden="true">
      <span className={cn("h-px flex-1", line)} />
      <GridMark size={14} filled={1} tone={tone} />
      <span className={cn("h-px flex-1", line)} />
    </div>
  );
}

/** Rótulo de seção (eyebrow) com o grid 2×2. */
export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]",
        tone === "light" ? "text-[#5B2A86]" : "text-[#E9DDF7]",
        className
      )}
    >
      <GridMark size={12} filled={1} tone={tone} />
      {children}
    </span>
  );
}
