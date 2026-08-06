"use client";

import { useEffect } from "react";
import { CONSENT_KEY } from "./CookieBanner";

export default function ConsentScripts({
  clarityId,
  gaId,
}: {
  clarityId?: string;
  gaId?: string;
}) {
  useEffect(() => {
    function grantAll() {
      // Libera cookies do GA4 via Consent Mode v2
      if (gaId && typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "denied", // anúncios continuam bloqueados
        });
      }

      // Carrega Clarity
      if (clarityId && !document.getElementById("ms-clarity-script")) {
        const s = document.createElement("script");
        s.id = "ms-clarity-script";
        s.innerHTML = `(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window,document,"clarity","script","${clarityId}");`;
        document.head.appendChild(s);
      }
    }

    if (localStorage.getItem(CONSENT_KEY) === "all") {
      grantAll();
    }

    window.addEventListener("ordo_consent_updated", grantAll);
    return () => window.removeEventListener("ordo_consent_updated", grantAll);
  }, [clarityId, gaId]);

  return null;
}
