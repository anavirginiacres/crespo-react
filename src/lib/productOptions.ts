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
  ].filter((group) => group.options.length > 0);
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

export type ProductDetailData = {
  id: number;
  name: string;
  caption: string | null;
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
