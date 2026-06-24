"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildCartLineId } from "@/lib/catalogUtils";

export type CartItemOptions = {
  color?: string;
  materials?: string;
  measures?: string;
  details?: string;
};

export type CartItem = {
  lineId: string;
  productId: number;
  name: string;
  image?: string | null;
  quantity: number;
  options: CartItemOptions;
};

type AddCartItemInput = {
  productId: number;
  name: string;
  image?: string | null;
  quantity?: number;
  options?: CartItemOptions;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: AddCartItemInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "crespo-cart";

function normalizeCartItems(stored: unknown): CartItem[] {
  if (!Array.isArray(stored)) return [];

  const items: CartItem[] = [];

  for (const entry of stored) {
    if (!entry || typeof entry !== "object") continue;

    const record = entry as Partial<CartItem> & {
      productId?: number;
      name?: string;
      quantity?: number;
    };

    if (!record.productId || !record.name) continue;

    const options = record.options ?? {};
    const lineId =
      record.lineId ??
      buildCartLineId(record.productId, {
        color: options.color,
        materials: options.materials,
        measures: options.measures,
      });

    items.push({
      lineId,
      productId: record.productId,
      name: record.name,
      image: record.image ?? null,
      quantity: record.quantity ?? 1,
      options,
    });
  }

  return items;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(normalizeCartItems(JSON.parse(stored)));
      }
    } catch {
      setItems([]);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((item: AddCartItemInput) => {
    const options = item.options ?? {};
    const lineId = buildCartLineId(item.productId, options);

    setItems((current) => {
      const existing = current.find((entry) => entry.lineId === lineId);

      if (existing) {
        return current.map((entry) =>
          entry.lineId === lineId
            ? {
                ...entry,
                quantity: entry.quantity + (item.quantity ?? 1),
              }
            : entry
        );
      }

      return [
        ...current,
        {
          lineId,
          productId: item.productId,
          name: item.name,
          image: item.image ?? null,
          quantity: item.quantity ?? 1,
          options,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((current) => current.filter((entry) => entry.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((entry) => entry.lineId !== lineId));
      return;
    }

    setItems((current) =>
      current.map((entry) =>
        entry.lineId === lineId ? { ...entry, quantity } : entry
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
