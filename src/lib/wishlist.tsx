import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Product } from "@/data/products";

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const WISHLIST_KEY = "cn_wishlist";

function loadWishlist(): Product[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items: Product[]) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch {}
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(loadWishlist);

  useEffect(() => {
    saveWishlist(items);
  }, [items]);

  const toggleWishlist = (product: Product) => {
    setItems((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isInWishlist = (productId: number) => items.some((p) => p.id === productId);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
