import { parseOptionList } from "./catalogUtils";

export type ProductOptionKey = "color" | "materials" | "measures";

export type ProductOptionGroup = {
  key: ProductOptionKey;
  label: string;
  options: string[];
};

export function getProductOptionGroups(product: {
  colors: string | null;
  materials: string | null;
  measures: string | null;
}): ProductOptionGroup[] {
  return [
    { key: "color", label: "Color", options: parseOptionList(product.colors) },
    {
      key: "materials",
      label: "Material",
      options: parseOptionList(product.materials),
    },
    {
      key: "measures",
      label: "Medida",
      options: parseOptionList(product.measures),
    },
  ].filter((group): group is ProductOptionGroup => group.options.length > 0);
}

export function getDefaultOptionSelections(
  optionGroups: ProductOptionGroup[]
): Partial<Record<ProductOptionKey, string>> {
  const selections: Partial<Record<ProductOptionKey, string>> = {};

  for (const group of optionGroups) {
    if (group.options.length === 1) {
      selections[group.key] = group.options[0];
    }
  }

  return selections;
}

export function getProductQuantityOptions(
  quantity: string | null | undefined
): string[] {
  if (quantity == null || !quantity.trim()) return [];
  return parseOptionList(quantity);
}

export function parseQuantityOption(value: string): number {
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isNaN(parsed) || parsed <= 0 ? 1 : parsed;
}

export function findQuantityOptionSelection(
  options: string[],
  quantity: number
): string {
  if (options.length === 0) return String(quantity);

  return (
    options.find((option) => parseQuantityOption(option) === quantity) ??
    options[0]
  );
}

export type ProductDetailData = {
  id: number;
  name: string;
  caption: string | null;
  image: string | null;
  colors: string | null;
  materials: string | null;
  measures: string | null;
  quantity: string | null;
  details: string | null;
  caution: string | null;
  delay: string | null;
  tags: string | null;
  category: { name: string };
  subcategory: { name: string };
  images: { id: number; src: string }[];
};

export function buildProductGalleryImages(product: {
  image: string | null;
  images: { id: number; src: string }[];
}): { id: number; src: string }[] {
  const gallery: { id: number; src: string }[] = [];

  if (product.image?.trim()) {
    gallery.push({ id: 0, src: product.image });
  }

  for (const image of product.images) {
    if (image.src !== product.image) {
      gallery.push(image);
    }
  }

  return gallery;
}
