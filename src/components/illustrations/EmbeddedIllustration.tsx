/**
 * Ilustração de Sistemas Embarcados: equipamento com computador de bordo
 * enviando dados para a plataforma online. Desenhada para fundo escuro.
 */
export default function EmbeddedIllustration({ label }: { label: string }) {
  const LILAC = "#C9B3E6";
  const P = "#7B4BA8";
  const GOLD = "#E3AE4A";
  const GLASS = "rgba(255,255,255,0.06)";
  const EDGE = "rgba(201,179,230,0.45)";

  const units = [
    { y: 84, w: 64, ok: true },
    { y: 112, w: 88, ok: true },
    { y: 140, w: 48, ok: false },
  ];

  return (
    <svg
      viewBox="0 0 520 360"
      role="img"
      aria-label={label}
      className="h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* sinal equipamento → plataforma */}
      <path d="M196 190 C 250 190, 256 110, 300 110" stroke="rgba(201,179,230,0.25)" strokeWidth="2" />
      <path d="M196 190 C 250 190, 256 110, 300 110" stroke={LILAC} strokeWidth="2" strokeLinecap="round" className="ill-dash" />
      <path d="M196 230 C 260 230, 270 262, 320 262" stroke="rgba(201,179,230,0.25)" strokeWidth="2" />
      <path d="M196 230 C 260 230, 270 262, 320 262" stroke={LILAC} strokeWidth="2" strokeLinecap="round" className="ill-dash" style={{ animationDelay: "0.7s" }} />

      {/* equipamento */}
      <rect x="28" y="120" width="168" height="190" rx="18" fill={GLASS} stroke={EDGE} strokeWidth="1.5" />
      <rect x="44" y="138" width="136" height="76" rx="10" fill="#1E1030" stroke={EDGE} />
      <path d="M58 196 L82 176 L104 186 L128 160 L164 170" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="58" y="150" width="46" height="6" rx="3" fill="rgba(201,179,230,0.5)" />
      <circle cx="60" cy="238" r="7" fill="rgba(201,179,230,0.25)" stroke={EDGE} />
      <circle cx="84" cy="238" r="7" fill="rgba(201,179,230,0.25)" stroke={EDGE} />
      <rect x="140" y="232" width="40" height="12" rx="6" fill={P} />
      <path d="M52 310 V326 M172 310 V326" stroke={EDGE} strokeWidth="6" strokeLinecap="round" />

      {/* computador de bordo */}
      <g>
        <path d="M76 262 H68 M76 272 H68 M76 282 H68 M148 262 H156 M148 272 H156 M148 282 H156" stroke={LILAC} strokeWidth="2" strokeLinecap="round" />
        <rect x="76" y="254" width="72" height="38" rx="7" fill="#5B2A86" stroke={LILAC} strokeWidth="1.5" />
        <rect className="ill-pulse" x="100" y="262" width="10" height="10" rx="2" fill="#E9DDF7" />
        <rect className="ill-pulse" style={{ animationDelay: "0.5s" }} x="113" y="262" width="10" height="10" rx="2" fill={LILAC} opacity="0.6" />
        <rect className="ill-pulse" style={{ animationDelay: "1.5s" }} x="100" y="275" width="10" height="10" rx="2" fill={LILAC} opacity="0.6" />
        <rect className="ill-pulse" style={{ animationDelay: "1s" }} x="113" y="275" width="10" height="10" rx="2" fill="#E9DDF7" />
      </g>

      {/* plataforma online: unidades */}
      <g className="ill-float">
        <rect x="300" y="40" width="196" height="136" rx="16" fill={GLASS} stroke={EDGE} strokeWidth="1.5" />
        <rect x="318" y="58" width="70" height="7" rx="3.5" fill="rgba(201,179,230,0.55)" />
        {units.map((u, i) => (
          <g key={i}>
            <circle cx="324" cy={u.y + 4} r="5" fill={u.ok ? LILAC : GOLD} />
            <rect x="338" y={u.y} width={u.w} height="8" rx="4" fill="rgba(255,255,255,0.18)" />
            <polyline
              points={`430,${u.y + 8} 442,${u.y + 2} 454,${u.y + 6} 466,${u.y} 478,${u.y + 4}`}
              stroke={LILAC}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}
      </g>

      {/* plataforma online: gráfico */}
      <g className="ill-float" style={{ animationDelay: "1.2s" }}>
        <rect x="320" y="206" width="176" height="118" rx="16" fill={GLASS} stroke={EDGE} strokeWidth="1.5" />
        <rect x="338" y="222" width="54" height="7" rx="3.5" fill="rgba(201,179,230,0.55)" />
        <path d="M338 304 H478" stroke="rgba(201,179,230,0.25)" />
        {[26, 40, 32, 52, 46, 62].map((h, i) => (
          <rect
            key={i}
            className="ill-bar"
            style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            x={342 + i * 23}
            y={304 - h}
            width="13"
            height={h}
            rx="3"
            fill={i === 5 ? "#E9DDF7" : "rgba(201,179,230,0.45)"}
          />
        ))}
      </g>
    </svg>
  );
}
