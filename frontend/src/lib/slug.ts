export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildCategoryProductosUrl(
  categorySlug: string,
  subcategorySlug?: string
) {
  const params = new URLSearchParams({ categoria: categorySlug });
  if (subcategorySlug) {
    params.set("subcategoria", subcategorySlug);
  }
  return `/productos?${params.toString()}`;
}
