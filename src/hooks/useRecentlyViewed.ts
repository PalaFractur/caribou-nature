import { useEffect, useState } from "react";
import { products, type Product } from "@/data/products";

const KEY = "cn_recently_viewed";
const MAX = 6;

export function useRecentlyViewed(currentSlug?: string) {
  const [recent, setRecent] = useState<Product[]>([]);

  useEffect(() => {
    if (!currentSlug) return;
    const stored: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const updated = [currentSlug, ...stored.filter((s) => s !== currentSlug)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  }, [currentSlug]);

  useEffect(() => {
    const stored: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const filtered = stored
      .map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is Product => !!p && p.slug !== currentSlug)
      .slice(0, 4);
    setRecent(filtered);
  }, [currentSlug]);

  return recent;
}
