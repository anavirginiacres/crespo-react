export const ADMIN_SESSION_COOKIE = "crespo_admin_session";
export const SESSION_MAX_AGE_DAYS = 7;

export type AdminRole = "ADMIN" | "USER";

export type ChangeStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ChangeAction =
  | "CREATE_PRODUCT"
  | "UPDATE_PRODUCT"
  | "ADD_IMAGE"
  | "DELETE_IMAGE";

export type SessionUser = {
  id: number;
  username: string;
  role: AdminRole;
};

export type CreateProductPayload = {
  id_category: number;
  id_subcategory: number;
  name: string;
  caption?: string | null;
  image?: string | null;
  materials?: string | null;
  measures?: string | null;
  quantity?: string | null;
  details?: string | null;
  caution?: string | null;
  colors?: string | null;
  delay?: string | null;
  tags?: string | null;
  new_product?: boolean;
  galleryImages?: string[];
};

export type UpdateProductPayload = {
  id_category?: number;
  id_subcategory?: number;
  name?: string;
  caption?: string | null;
  image?: string | null;
  materials?: string | null;
  measures?: string | null;
  quantity?: string | null;
  details?: string | null;
  caution?: string | null;
  colors?: string | null;
  delay?: string | null;
  tags?: string | null;
  new_product?: boolean;
};

export type AddImagePayload = {
  src: string;
};

export type DeleteImagePayload = {
  imageId: number;
};

export function isAdminRole(role: string): role is AdminRole {
  return role === "ADMIN" || role === "USER";
}
