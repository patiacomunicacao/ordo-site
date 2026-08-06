"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      <button
        onClick={() => switchLocale("pt")}
        disabled={isPending}
        className="px-1.5 py-0.5 rounded transition-colors disabled:opacity-50"
        style={{
          color: locale === "pt" ? "#4F3DB5" : "#9ca3af",
          fontWeight: locale === "pt" ? 700 : 400,
        }}
      >
        PT
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className="px-1.5 py-0.5 rounded transition-colors disabled:opacity-50"
        style={{
          color: locale === "en" ? "#4F3DB5" : "#9ca3af",
          fontWeight: locale === "en" ? 700 : 400,
        }}
      >
        EN
      </button>
    </div>
  );
}
