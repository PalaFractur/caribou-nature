import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { getCompareList, removeFromCompare, clearCompare } from "@/lib/compare";
import { useCart } from "@/lib/cart";
import { useMeta } from "@/hooks/useMeta";
import { CheckCircle, ShoppingCart, X, Plus } from "lucide-react";

export default function Comparer() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [compareIds, setCompareIds] = useState<number[]>(() => getCompareList());

  useMeta({
    title: "Comparateur de produits — Caribou Nature",
    description: "Comparez jusqu'à 3 jouets côte à côte pour faire le meilleur choix.",
  });

  useEffect(() => {
    if (compareIds.length === 0) {
      navigate("/catalogue");
    }
  }, [compareIds, navigate]);

  const compareProducts = compareIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  function handleRemove(id: number) {
    removeFromCompare(id);
    const newList = getCompareList();
    setCompareIds(newList);
    window.dispatchEvent(new Event("compare-updated"));
    if (newList.length === 0) {
      navigate("/catalogue");
    }
  }

  const ageLabel = (min: number, max: number) => {
    if (max >= 99) return "Tout âge";
    if (min === 0) return `0-${max} ans`;
    return `${min}-${max} ans`;
  };


  const colCount = Math.max(compareProducts.length, 1);

  return (
    <div className="min-h-screen bg-background page-transition">
      <TopBar />
      <Header />

      <section className="container py-12 pb-16">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl mb-1">Comparateur</h1>
            <p className="font-body text-gris-chaud">Comparez les produits côte à côte</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearCompare();
              window.dispatchEvent(new Event("compare-updated"));
              navigate("/catalogue");
            }}
          >
            Tout effacer
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <colgroup>
              <col style={{ width: "140px" }} />
              {compareProducts.map((p) => (
                <col key={p.id} style={{ width: `${Math.floor(100 / (colCount + 1))}%` }} />
              ))}
              {compareProducts.length < 3 && (
                <col style={{ width: `${Math.floor(100 / (colCount + 1))}%` }} />
              )}
            </colgroup>

            <tbody>
              {/* Remove row */}
              <tr>
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-middle"></td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-3 text-center border border-sable/30 bg-blanc-casse">
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="flex items-center gap-1 mx-auto font-body text-xs text-gris-chaud hover:text-terracotta transition-colors"
                    >
                      <X size={14} /> Retirer
                    </button>
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="p-3 border border-dashed border-sable bg-sable/20 text-center">
                    <Link
                      to="/catalogue"
                      className="flex items-center gap-1 justify-center mx-auto font-body text-xs text-gris-chaud hover:text-ocre transition-colors"
                    >
                      <Plus size={14} /> Ajouter un produit
                    </Link>
                  </td>
                )}
              </tr>

              {/* Image row */}
              <tr>
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-middle bg-sable/10">
                  Image
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 border border-sable/30 bg-blanc-casse text-center">
                    <Link to={`/produit/${p.slug}`}>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-32 h-32 object-cover rounded-card mx-auto"
                      />
                    </Link>
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="border border-dashed border-sable bg-sable/20" />
                )}
              </tr>

              {/* Name */}
              <tr className="bg-sable/10">
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-middle">
                  Nom
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 border border-sable/30 bg-blanc-casse text-center">
                    <Link
                      to={`/produit/${p.slug}`}
                      className="font-display text-base text-brun font-semibold hover:text-ocre transition-colors"
                    >
                      {p.name}
                    </Link>
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="border border-dashed border-sable bg-sable/20" />
                )}
              </tr>

              {/* Price */}
              <tr>
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-middle bg-sable/10">
                  Prix
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 border border-sable/30 bg-blanc-casse text-center">
                    <span className="font-display text-xl font-bold text-brun">{p.price} €</span>
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="border border-dashed border-sable bg-sable/20" />
                )}
              </tr>

              {/* Category */}
              <tr className="bg-sable/10">
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-middle">
                  Catégorie
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 border border-sable/30 bg-blanc-casse text-center">
                    <span className="font-body text-sm text-brun">{p.category}</span>
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="border border-dashed border-sable bg-sable/20" />
                )}
              </tr>

              {/* Age */}
              <tr>
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-middle bg-sable/10">
                  Âge
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 border border-sable/30 bg-blanc-casse text-center">
                    <span className="font-body text-sm text-brun">{ageLabel(p.ageMin, p.ageMax)}</span>
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="border border-dashed border-sable bg-sable/20" />
                )}
              </tr>

              {/* Stock */}
              <tr className="bg-sable/10">
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-middle">
                  Stock
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 border border-sable/30 bg-blanc-casse text-center">
                    {p.stock === 0 ? (
                      <span className="font-body text-sm text-terracotta font-semibold">Rupture</span>
                    ) : p.stock <= 5 ? (
                      <span className="font-body text-sm text-amber-600 font-semibold">Plus que {p.stock}</span>
                    ) : (
                      <span className="font-body text-sm text-vert-sauge font-semibold">En stock ({p.stock})</span>
                    )}
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="border border-dashed border-sable bg-sable/20" />
                )}
              </tr>

              {/* Description */}
              <tr>
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-top bg-sable/10">
                  Description
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 border border-sable/30 bg-blanc-casse align-top">
                    <p className="font-body text-sm text-gris-chaud leading-relaxed">
                      {p.description.slice(0, 100)}…
                    </p>
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="border border-dashed border-sable bg-sable/20" />
                )}
              </tr>

              {/* Details */}
              <tr className="bg-sable/10">
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-top">
                  Caractéristiques
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 border border-sable/30 bg-blanc-casse align-top">
                    <ul className="space-y-1.5">
                      {p.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 font-body text-xs text-brun">
                          <CheckCircle size={12} className="text-vert-sauge shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="border border-dashed border-sable bg-sable/20" />
                )}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-3 font-body text-xs text-gris-chaud font-semibold uppercase tracking-wider align-middle bg-sable/10">
                  Actions
                </td>
                {compareProducts.map((p) => (
                  <td key={p.id} className="p-4 border border-sable/30 bg-blanc-casse text-center">
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => addToCart(p, 1)}
                        disabled={p.stock === 0}
                        size="sm"
                        className="w-full gap-1.5"
                      >
                        <ShoppingCart size={14} /> Ajouter au panier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(p.id)}
                        className="w-full text-xs text-gris-chaud"
                      >
                        Retirer
                      </Button>
                    </div>
                  </td>
                ))}
                {compareProducts.length < 3 && (
                  <td className="border border-dashed border-sable bg-sable/20">
                    <div className="p-4 text-center">
                      <Link
                        to="/catalogue"
                        className="inline-flex items-center gap-1.5 font-body text-sm text-ocre hover:text-terracotta transition-colors"
                      >
                        <Plus size={14} /> Ajouter un produit
                      </Link>
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      <Footer />
    </div>
  );
}
