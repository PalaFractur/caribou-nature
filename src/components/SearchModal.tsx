import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { products } from "@/data/products";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ageLabel = (min: number, max: number) => {
  if (max >= 99) return "Tout âge";
  if (min === 0) return `0-${max} ans`;
  return `${min}-${max} ans`;
};

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results = query.trim().length >= 2
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Overlay */}
      <div className="absolute inset-0 bg-brun/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-blanc-casse shadow-xl w-full max-w-2xl mx-auto mt-20 rounded-card overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-sable">
          <Search size={20} className="text-gris-chaud shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un jouet, une catégorie…"
            className="border-0 shadow-none focus-visible:ring-0 text-base bg-transparent px-0 h-auto"
          />
          <button onClick={onClose} className="text-gris-chaud hover:text-brun transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="divide-y divide-sable max-h-[400px] overflow-y-auto">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/produit/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-creme transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-brun text-sm truncate">{product.name}</p>
                    <p className="font-body text-xs text-gris-chaud">{product.category} · {ageLabel(product.ageMin, product.ageMax)}</p>
                  </div>
                  <span className="font-body font-bold text-brun shrink-0">{product.price} €</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="font-body text-gris-chaud">Aucun produit trouvé pour <strong>"{query}"</strong></p>
            <Link
              to={`/catalogue?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="font-body text-sm text-ocre hover:text-terracotta font-semibold mt-2 inline-block"
            >
              Voir tous les résultats →
            </Link>
          </div>
        )}

        {query.trim().length >= 2 && results.length > 0 && (
          <div className="px-5 py-3 border-t border-sable bg-creme">
            <Link
              to={`/catalogue?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="font-body text-sm text-ocre hover:text-terracotta font-semibold"
            >
              Voir tous les résultats pour "{query}" →
            </Link>
          </div>
        )}

        {query.trim().length < 2 && (
          <div className="px-5 py-6 text-center">
            <p className="font-body text-sm text-gris-chaud">Tapez au moins 2 caractères pour rechercher</p>
          </div>
        )}
      </div>
    </div>
  );
}
