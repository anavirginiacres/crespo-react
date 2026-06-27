const FIELD_LABELS: Record<string, string> = {
  id_category: "Categoría",
  id_subcategory: "Subcategoría",
  name: "Nombre",
  caption: "Caption",
  image: "Imagen principal",
  materials: "Materiales",
  measures: "Medidas",
  quantity: "Cantidad",
  details: "Detalles",
  caution: "Precaución",
  colors: "Colores",
  delay: "Demora",
  tags: "Tags",
  new_product: "Producto nuevo",
  galleryImages: "Imágenes de galería",
  src: "URL de imagen",
  imageId: "ID de imagen",
};

export type CurrentProductContext = {
  id: number;
  name: string;
  caption: string | null;
  image: string | null;
  materials: string | null;
  measures: string | null;
  quantity: string | null;
  details: string | null;
  caution: string | null;
  colors: string | null;
  delay: string | null;
  tags: string | null;
  new_product: boolean;
  id_category: number;
  id_subcategory: number;
  category?: { name: string };
  subcategory?: { name: string };
  images?: { id: number; src: string }[];
};

export type CategoryLookup = {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
};

export type ChangeDiffRow = {
  key: string;
  label: string;
  current: string;
  proposed: string;
  isChanged: boolean;
};

export function getActionLabel(action: string): string {
  switch (action) {
    case "CREATE_PRODUCT":
      return "Crear producto";
    case "UPDATE_PRODUCT":
      return "Actualizar producto";
    case "ADD_IMAGE":
      return "Agregar imagen";
    case "DELETE_IMAGE":
      return "Eliminar imagen";
    default:
      return action;
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "PENDIENTE";
    case "APPROVED":
      return "APROBADO";
    case "REJECTED":
      return "RECHAZADO";
    default:
      return status;
  }
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null && b == null) return true;
  if (typeof a === "boolean" || typeof b === "boolean") return a === b;
  return String(a ?? "") === String(b ?? "");
}

function resolveCategoryName(
  categoryId: unknown,
  categories: CategoryLookup[]
): string {
  const id = Number(categoryId);
  if (!Number.isInteger(id)) return formatValue(categoryId);
  return categories.find((category) => category.id === id)?.name ?? String(id);
}

function resolveSubcategoryName(
  subcategoryId: unknown,
  categories: CategoryLookup[]
): string {
  const id = Number(subcategoryId);
  if (!Number.isInteger(id)) return formatValue(subcategoryId);
  for (const category of categories) {
    const match = category.subcategories.find(
      (subcategory) => subcategory.id === id
    );
    if (match) return match.name;
  }
  return String(id);
}

function formatFieldValue(
  key: string,
  value: unknown,
  categories: CategoryLookup[],
  currentProduct?: CurrentProductContext | null
): string {
  if (key === "id_category") {
    return (
      currentProduct?.category?.name ??
      resolveCategoryName(value, categories)
    );
  }

  if (key === "id_subcategory") {
    return (
      currentProduct?.subcategory?.name ??
      resolveSubcategoryName(value, categories)
    );
  }

  if (key === "imageId") {
    const imageId = Number(value);
    const image = currentProduct?.images?.find((item) => item.id === imageId);
    if (image) return `#${imageId} · ${image.src}`;
    return formatValue(value);
  }

  return formatValue(value);
}

function buildProductFieldRows(
  payload: Record<string, unknown>,
  categories: CategoryLookup[],
  currentProduct?: CurrentProductContext | null,
  highlightAll = false
): ChangeDiffRow[] {
  return Object.entries(payload).map(([key, proposedValue]) => {
    const currentValue =
      currentProduct && key in currentProduct
        ? (currentProduct as Record<string, unknown>)[key]
        : undefined;

    const isChanged =
      highlightAll || !valuesEqual(currentValue, proposedValue);

    return {
      key,
      label: FIELD_LABELS[key] ?? key,
      current: formatFieldValue(key, currentValue, categories, currentProduct),
      proposed: formatFieldValue(key, proposedValue, categories),
      isChanged,
    };
  });
}

export function buildChangeDiffRows(input: {
  action: string;
  payload: string;
  currentProduct?: CurrentProductContext | null;
  categories: CategoryLookup[];
}): ChangeDiffRow[] {
  const payload = JSON.parse(input.payload) as Record<string, unknown>;

  switch (input.action) {
    case "CREATE_PRODUCT":
      return buildProductFieldRows(
        payload,
        input.categories,
        null,
        true
      );

    case "UPDATE_PRODUCT":
      return buildProductFieldRows(
        payload,
        input.categories,
        input.currentProduct,
        false
      ).filter((row) => row.isChanged);

    case "ADD_IMAGE":
      return [
        {
          key: "src",
          label: FIELD_LABELS.src,
          current: "—",
          proposed: formatValue(payload.src),
          isChanged: true,
        },
      ];

    case "DELETE_IMAGE": {
      const imageId = payload.imageId;
      const image = input.currentProduct?.images?.find(
        (item) => item.id === Number(imageId)
      );

      return [
        {
          key: "imageId",
          label: FIELD_LABELS.imageId,
          current: image ? `#${image.id} · ${image.src}` : "—",
          proposed: "Eliminar",
          isChanged: true,
        },
      ];
    }

    default:
      return Object.entries(payload).map(([key, value]) => ({
        key,
        label: FIELD_LABELS[key] ?? key,
        current: "—",
        proposed: formatValue(value),
        isChanged: true,
      }));
  }
}
