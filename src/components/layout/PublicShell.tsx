"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useTranslations } from "next-intl";

/**
 * Renders the public Header on every route except /admin/*.
 * Placed in the root layout so it covers all pages automatically.
 */
export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const t = useTranslations("nav");

  return (
    <>
      {!isAdmin && (
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#5B2A86] focus:shadow-lg"
        >
          {t("skipToContent")}
        </a>
      )}
      {!isAdmin && <Navbar />}
      {children}
    </>
  );
}
