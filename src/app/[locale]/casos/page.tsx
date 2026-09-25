import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Footer from "@/components/layout/Footer";
import CaseClickUp from "@/components/cases/CaseClickUp";
import { Eyebrow } from "@/components/brand/GridMark";
import { getCaseContent } from "@/content/case";

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
    <>
    <main id="conteudo" className="min-h-screen pt-20">
      <div className="relative overflow-hidden bg-[#F8F5FC] px-4 pb-14 pt-14 text-center">
        <div className="bg-grid-2x2 pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-4 font-heading text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600">
            {t("subtitle")}
          </p>
        </div>
      </div>
      <CaseClickUp
        content={getCaseContent(locale)}
        contactHref={locale === "en" ? "/en#contato" : "/#contato"}
      />
    </main>
    <Footer />
    </>
  );
}
