/**
 * Troca das ilustrações por imagens próprias.
 *
 * 1. Coloque o arquivo em /public/illustrations/ (ex.: hero.webp).
 * 2. Descomente a linha correspondente abaixo e ajuste largura/altura
 *    (tamanho real do arquivo, em pixels).
 *
 * Enquanto a entrada estiver comentada, o site usa a ilustração SVG padrão.
 */
export type IllustrationName = "hero" | "embedded";

export const ILLUSTRATION_IMAGES: Partial<
  Record<IllustrationName, { src: string; width: number; height: number }>
> = {
  // hero: { src: "/illustrations/hero.webp", width: 1120, height: 1000 },
  // embedded: { src: "/illustrations/embedded.webp", width: 1040, height: 720 },
};
