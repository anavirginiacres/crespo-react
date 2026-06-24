import { StaticImageData } from "next/image";

export const placeholderClients = [
  "Cliente 1",
  "Cliente 2",
  "Cliente 3",
  "Cliente 4",
  "Cliente 5",
  "Cliente 6",
];

export type ClientLogo =
  | { kind: "placeholder"; label: string }
  | { kind: "image"; label: string; image: StaticImageData };

function loadImagesFromFolder(): ClientLogo[] {
  const context = require.context(
    "../styles/images/clients",
    false,
    /\.(png|jpe?g|svg|webp)$/i
  ) as {
    keys: () => string[];
    (id: string): StaticImageData | { default: StaticImageData };
  };

  const keys = context.keys().sort();

  if (keys.length === 0) {
    return [];
  }

  return keys.map((key) => {
    const imported = context(key);
    const image =
      typeof imported === "object" && imported !== null && "default" in imported
        ? imported.default
        : (imported as StaticImageData);
    const filename = key.replace("./", "");

    return {
      kind: "image" as const,
      label: filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      image,
    };
  });
}

export function getClientLogos(): ClientLogo[] {
  const images = loadImagesFromFolder();

  if (images.length > 0) {
    return images;
  }

  return placeholderClients.map((label) => ({ kind: "placeholder", label }));
}
