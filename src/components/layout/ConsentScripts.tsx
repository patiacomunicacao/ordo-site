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
    function loadGA4() {
      if (!gaId || document.getElementById("ga4-script")) return;
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = function (...args: unknown[]) {
        window.dataLayer!.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", gaId, { anonymize_ip: true });

      const s = document.createElement("script");
      s.id = "ga4-script";
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
    }

    function loadClarity() {
      if (!clarityId || document.getElementById("ms-clarity-script")) return;
      const s = document.createElement("script");
      s.id = "ms-clarity-script";
      s.innerHTML = `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window,document,"clarity","script","${clarityId}");`;
      document.head.appendChild(s);
    }

    if (localStorage.getItem(CONSENT_KEY) === "all") {
      loadGA4();
      loadClarity();
    }

    function onConsentUpdate() {
      if (localStorage.getItem(CONSENT_KEY) === "all") {
        loadGA4();
        loadClarity();
      }
    }

    window.addEventListener("ordo_consent_updated", onConsentUpdate);
    return () => window.removeEventListener("ordo_consent_updated", onConsentUpdate);
  }, [clarityId, gaId]);

  return null;
}
