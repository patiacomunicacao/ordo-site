import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*?_rsc=", // bloqueia parâmetros internos do Next.js (RSC prefetch)
          "/admin/",  // painel administrativo
        ],
      },
    ],
    sitemap: "https://ordoautomacao.com.br/sitemap.xml",
    host: "https://ordoautomacao.com.br",
  };
}
