"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

export const CONSENT_KEY = "ordo_consent";

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export default function CookieBanner({ locale }: { locale: string }) {
  // No servidor (e antes da hidratação) o banner fica oculto.
  const hasConsent = useSyncExternalStore(
    subscribeToStorage,
    () => !!localStorage.getItem(CONSENT_KEY),
    () => true
  );
  const [dismissed, setDismissed] = useState(false);
  const visible = !hasConsent && !dismissed;

  function accept() {
    localStorage.setItem(CONSENT_KEY, "all");
    setDismissed(true);
    window.dispatchEvent(new Event("ordo_consent_updated"));
  }

  function essentialOnly() {
    localStorage.setItem(CONSENT_KEY, "essential");
    setDismissed(true);
  }

  if (!visible) return null;

  const isEn = locale === "en";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-600 flex-1 leading-relaxed">
          {isEn ? (
            <>
              We use cookies to improve your experience and analyze traffic (Microsoft Clarity). By clicking{" "}
              <strong>Accept all</strong>, you consent to optional cookies.{" "}
            </>
          ) : (
            <>
              Usamos cookies para melhorar sua experiência e analisar o tráfego do site (Microsoft Clarity). Ao clicar em{" "}
              <strong>Aceitar todos</strong>, você consente com cookies opcionais.{" "}
            </>
          )}
          <Link
            href={isEn ? "/en/politica-de-privacidade" : "/politica-de-privacidade"}
            className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: "#5B2A86" }}
          >
            {isEn ? "Privacy Policy" : "Política de Privacidade"}
          </Link>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={essentialOnly}
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {isEn ? "Essential only" : "Apenas essenciais"}
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#5B2A86" }}
          >
            {isEn ? "Accept all" : "Aceitar todos"}
          </button>
        </div>
      </div>
    </div>
  );
}
