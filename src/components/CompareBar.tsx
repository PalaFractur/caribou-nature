import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Scale } from "lucide-react";
import { getCompareList, removeFromCompare, clearCompare } from "@/lib/compare";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

export default function CompareBar() {
  const navigate = useNavigate();
  const [compareIds, setCompareIds] = useState<number[]>(getCompareList);

  // Sync with localStorage changes (dispatched from ProductCard)
  useEffect(() => {
    const handler = () => setCompareIds(getCompareList());
    window.addEventListener("compare-updated", handler);
    return () => window.removeEventListener("compare-updated", handler);
  }, []);

  if (compareIds.length === 0) return null;

  const compareProducts = compareIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const handleRemove = (id: number) => {
    removeFromCompare(id);
    setCompareIds(getCompareList());
    window.dispatchEvent(new Event("compare-updated"));
  };

  const handleClear = () => {
    clearCompare();
    setCompareIds([]);
    window.dispatchEvent(new Event("compare-updated"));
  };

  const handleCompare = () => {
    navigate("/comparer");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-blanc-casse border-t-2 border-ocre shadow-card">
      <div className="container py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 shrink-0">
          <Scale size={18} className="text-ocre" />
          <span className="font-body font-semibold text-brun text-sm">
            Comparer ({compareIds.length}/3)
          </span>
        </div>

        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {compareProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 bg-sable rounded-btn px-3 py-1.5"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-8 h-8 rounded object-cover shrink-0"
              />
              <span className="font-body text-xs text-brun font-medium max-w-[120px] truncate">
                {p.name}
              </span>
              <button
                onClick={() => handleRemove(p.id)}
                aria-label={`Retirer ${p.name} de la comparaison`}
                className="text-gris-chaud hover:text-terracotta transition-colors ml-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Placeholder slots */}
          {compareIds.length < 3 &&
            Array.from({ length: 3 - compareIds.length }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="flex items-center justify-center w-[140px] h-[44px] border-2 border-dashed border-sable rounded-btn"
              >
                <span className="font-body text-xs text-gris-chaud/50">
                  + produit
                </span>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleCompare}
            disabled={compareIds.length < 2}
            size="sm"
            className="gap-1.5"
          >
            <Scale size={14} /> Comparer
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className="text-gris-chaud"
          >
            Vider
          </Button>
        </div>
      </div>
    </div>
  );
}
