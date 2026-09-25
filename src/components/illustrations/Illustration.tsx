import Image from "next/image";
import HeroIllustration from "./HeroIllustration";
import EmbeddedIllustration from "./EmbeddedIllustration";
import { ILLUSTRATION_IMAGES, type IllustrationName } from "./config";

const SVGS: Record<IllustrationName, React.ComponentType<{ label: string }>> = {
  hero: HeroIllustration,
  embedded: EmbeddedIllustration,
};

/**
 * Ponto único de troca das ilustrações: usa a imagem configurada em
 * `config.ts` se existir; caso contrário, a ilustração SVG da marca.
 */
export default function Illustration({
  name,
  alt,
  preload = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  name: IllustrationName;
  alt: string;
  preload?: boolean;
  sizes?: string;
}) {
  const image = ILLUSTRATION_IMAGES[name];
  if (image) {
    return (
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt}
        preload={preload}
        sizes={sizes}
        className="h-auto w-full"
      />
    );
  }
  const Svg = SVGS[name];
  return <Svg label={alt} />;
}
