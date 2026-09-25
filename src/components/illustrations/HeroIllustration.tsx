/**
 * Ilustração da capa: fluxo de processo → ferramentas conectadas ao grid ORDO → painel.
 * SVG próprio, sem dependências. Animações em globals.css (classes `.ill-*`),
 * desligadas com `prefers-reduced-motion`.
 */
export default function HeroIllustration({ label }: { label: string }) {
  const P = "#5B2A86";
  const LILAC = "#C9B3E6";
  const SOFT = "#F3EEF9";
  const LINE = "#E4D8F2";
  const GOLD = "#E3AE4A";

  const tools = [
    { x: 92, y: 272, d: "M116 272 C 170 272, 200 262, 252 262" },
    { x: 168, y: 402, d: "M186 386 C 210 340, 240 312, 262 298" },
    { x: 430, y: 80, d: "M416 100 C 380 150, 350 190, 330 226" },
    { x: 504, y: 208, d: "M480 212 C 420 220, 380 236, 336 248" },
  ];

  const bars = [34, 52, 44, 66, 58, 80];

  return (
    <svg
      viewBox="0 0 560 500"
      role="img"
      aria-label={label}
      className="h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* conexões ferramentas → hub */}
      {tools.map((t, i) => (
        <g key={i}>
          <path d={t.d} stroke={LINE} strokeWidth="2" />
          <path
            d={t.d}
            stroke={P}
            strokeWidth="2"
            strokeLinecap="round"
            className="ill-dash"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        </g>
      ))}

      {/* card: fluxo de processo */}
      <g className="ill-float">
        <rect x="16" y="24" width="268" height="176" rx="18" fill="#fff" stroke={LINE} strokeWidth="1.5" />
        <rect x="36" y="46" width="84" height="8" rx="4" fill={LINE} />
        <rect x="36" y="62" width="52" height="6" rx="3" fill={SOFT} />
        <circle cx="236" cy="52" r="4" fill={LILAC} />
        <circle cx="252" cy="52" r="4" fill={P} />

        <path d="M70 124 H92 M136 124 H160 M200 124 H222" stroke={P} strokeWidth="2" />
        <path d="M180 144 V172 H244 V140" stroke={LILAC} strokeWidth="2" strokeDasharray="4 4" />

        <circle cx="56" cy="124" r="14" fill={SOFT} stroke={P} strokeWidth="2" />
        <rect x="92" y="108" width="44" height="32" rx="8" fill={P} />
        <path d="M180 104 L200 124 L180 144 L160 124 Z" fill="#fff" stroke={P} strokeWidth="2" />
        <rect x="222" y="108" width="44" height="32" rx="8" fill={LILAC} />

        <rect x="100" y="120" width="28" height="4" rx="2" fill="#fff" opacity="0.8" />
        <rect x="230" y="120" width="28" height="4" rx="2" fill="#fff" opacity="0.9" />
        <circle cx="180" cy="124" r="4" fill={GOLD} />
      </g>

      {/* hub ORDO (grid 2×2) */}
      <circle cx="294" cy="262" r="74" fill={SOFT} />
      <circle cx="294" cy="262" r="54" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <g>
        <rect className="ill-pulse" x="263" y="231" width="28" height="28" rx="6" fill={P} />
        <rect className="ill-pulse" style={{ animationDelay: "0.6s" }} x="297" y="231" width="28" height="28" rx="6" fill={LILAC} />
        <rect className="ill-pulse" style={{ animationDelay: "1.8s" }} x="263" y="265" width="28" height="28" rx="6" fill={LILAC} />
        <rect className="ill-pulse" style={{ animationDelay: "1.2s" }} x="297" y="265" width="28" height="28" rx="6" fill={P} />
      </g>

      {/* ferramentas */}
      {tools.map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y})`}>
          <circle r="26" fill="#fff" stroke={LINE} strokeWidth="1.5" />
          {i === 0 && (
            // mensagem
            <g stroke={P} strokeWidth="2" strokeLinejoin="round">
              <path d="M-11 -9 H11 a3 3 0 0 1 3 3 V5 a3 3 0 0 1 -3 3 H-2 L-8 13 V8 H-11 a3 3 0 0 1 -3 -3 V-6 a3 3 0 0 1 3 -3 Z" />
              <path d="M-6 -2 H6" strokeLinecap="round" />
            </g>
          )}
          {i === 1 && (
            // planilha
            <g stroke={P} strokeWidth="2">
              <rect x="-11" y="-9" width="22" height="18" rx="3" />
              <path d="M-11 -3 H11 M-11 3 H11 M-3 -9 V9" />
            </g>
          )}
          {i === 2 && (
            // agenda
            <g stroke={P} strokeWidth="2" strokeLinecap="round">
              <rect x="-11" y="-8" width="22" height="19" rx="3" />
              <path d="M-11 -2 H11 M-5 -12 V-6 M5 -12 V-6" />
              <circle cx="-4" cy="4" r="1" fill={P} />
              <circle cx="3" cy="4" r="1" fill={P} />
            </g>
          )}
          {i === 3 && (
            // documento
            <g stroke={P} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
              <path d="M-8 -12 H4 L10 -6 V12 H-8 Z" />
              <path d="M-3 -1 H5 M-3 5 H5" />
            </g>
          )}
        </g>
      ))}

      {/* card: painel */}
      <g className="ill-float" style={{ animationDelay: "1.5s" }}>
        <rect x="290" y="318" width="254" height="170" rx="18" fill="#fff" stroke={LINE} strokeWidth="1.5" />
        <rect x="310" y="338" width="70" height="8" rx="4" fill={LINE} />
        <rect x="444" y="334" width="80" height="18" rx="9" fill={SOFT} />
        <rect x="454" y="341" width="40" height="4" rx="2" fill={P} />
        <path d="M310 466 H524" stroke={LINE} strokeWidth="1.5" />
        {bars.map((h, i) => (
          <rect
            key={i}
            className="ill-bar"
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            x={318 + i * 34}
            y={466 - h}
            width="18"
            height={h}
            rx="4"
            fill={i === bars.length - 1 ? P : i % 2 ? LILAC : "#E4D8F2"}
          />
        ))}
        <polyline
          points="327,426 361,410 395,418 429,394 463,402 497,380"
          stroke={GOLD}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="497" cy="380" r="4.5" fill="#fff" stroke={GOLD} strokeWidth="2.5" />
      </g>
    </svg>
  );
}
