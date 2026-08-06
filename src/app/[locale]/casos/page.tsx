import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CaseClickUp from "@/components/cases/CaseClickUp";

interface Props {
  params: Promise<{ locale: string }>;
}

const BASE = "https://ordoautomacao.com.br";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  const isEn = locale === "en";
  const url = isEn ? `${BASE}/en/casos` : `${BASE}/casos`;
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { "pt-BR": `${BASE}/casos`, en: `${BASE}/en/casos` },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export default async function CasosPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });

  return (
    <main className="min-h-screen pt-20">
      <div className="bg-white pt-14 pb-16 text-center border-b border-gray-100">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#4F3DB5" }}
        >
          {t("eyebrow")}
        </span>
        <h1
          className="mt-3 text-4xl font-extrabold text-gray-900"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("title")}
        </h1>
        <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
          {t("subtitle")}
        </p>
      </div>
      <CaseClickUp />
    </main>
  );
}
