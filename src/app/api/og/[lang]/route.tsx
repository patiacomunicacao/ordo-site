import { ImageResponse } from "next/og";

// Imagem de compartilhamento (Open Graph) gerada no build, uma por idioma.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ lang: "pt" }, { lang: "en" }];
}

const TEXT = {
  pt: {
    title: "Sua operação organizada, automatizada e pronta para crescer.",
    tags: ["Diagnóstico", "Automação", "Agentes de IA", "Consultoria", "Sistemas Embarcados"],
    brand: "ORDO Automação",
  },
  en: {
    title: "Your operation organized, automated and ready to grow.",
    tags: ["Assessment", "Automation", "AI Agents", "Consulting", "Embedded Systems"],
    brand: "ORDO Automação",
  },
} as const;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const t = TEXT[lang === "en" ? "en" : "pt"];
  const cell = (color: string) => ({
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: color,
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#1E1030",
          padding: 72,
          color: "white",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", flexWrap: "wrap", width: 64, gap: 6 }}>
              <div style={{ width: 29, height: 29, borderRadius: 7, backgroundColor: "#E9DDF7" }} />
              <div style={{ width: 29, height: 29, borderRadius: 7, backgroundColor: "#7B4BA8" }} />
              <div style={{ width: 29, height: 29, borderRadius: 7, backgroundColor: "#7B4BA8" }} />
              <div style={{ width: 29, height: 29, borderRadius: 7, backgroundColor: "#E9DDF7" }} />
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>{t.brand}</div>
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1, maxWidth: 760 }}>{t.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, maxWidth: 800 }}>
            {t.tags.map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 22,
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "2px solid rgba(201,179,230,0.5)",
                  color: "#E9DDF7",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 156, gap: 16, alignSelf: "center" }}>
          <div style={cell("#5B2A86")} />
          <div style={cell("#C9B3E6")} />
          <div style={cell("#C9B3E6")} />
          <div style={cell("#5B2A86")} />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
