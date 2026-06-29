const API_BASE = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error ?? "Request failed");
  }
  return data as T;
}

export type CategoryNav = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  subcategories: { id: number; name: string; slug: string }[];
};

export const api = {
  getCategories: () => request<{ categories: CategoryNav[] }>("/categories"),
  getProducts: () =>
    request<{ products: import("@/lib/catalogUtils").CatalogProduct[] }>(
      "/products"
    ),
  getNewProducts: (limit = 4) =>
    request<{ products: unknown[] }>(`/products/new?limit=${limit}`),
  getProduct: (id: number) =>
    request<{ product: import("@/lib/productOptions").ProductDetailData }>(
      `/products/${id}`
    ),
  suggestProducts: (q: string) =>
    request<
      {
        id: number;
        name: string;
        caption: string | null;
        tags: string | null;
      }[]
    >(`/products/suggest?q=${encodeURIComponent(q)}`),
  getQuantityOptionsMap: () =>
    request<{ map: Record<number, string[]> }>("/products/quantity-options"),

  adminSession: () =>
    request<{ user: import("@/lib/admin/types").SessionUser | null }>(
      "/admin/auth/session"
    ),
  adminLogin: (username: string, password: string) =>
    request<{ user: import("@/lib/admin/types").SessionUser }>(
      "/admin/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }
    ),
  adminLogout: () =>
    request<{ ok: boolean }>("/admin/auth/session", { method: "DELETE" }),
};
