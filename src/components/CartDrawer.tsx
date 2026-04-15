import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useEffect } from "react";

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  // Bloquer le scroll body quand le drawer est ouvert
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Fermer sur Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeDrawer]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[70] bg-brun/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[75] w-full max-w-md bg-blanc-casse shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Panier"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sable bg-blanc-casse shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl">Mon panier</h2>
            {cartCount > 0 && (
              <span className="bg-ocre text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center font-body">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-gris-chaud hover:text-brun transition-colors rounded-full hover:bg-sable"
            aria-label="Fermer le panier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <ShoppingBag size={52} className="text-sable" />
              <div>
                <p className="font-display text-lg text-brun mb-1">Votre panier est vide</p>
                <p className="font-body text-sm text-gris-chaud">Découvrez notre sélection de jouets</p>
              </div>
              <Button onClick={closeDrawer} asChild>
                <Link to="/catalogue">Voir le catalogue</Link>
              </Button>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-4">
              {/* Barre livraison */}
              {cartTotal < 20 ? (
                <div className="bg-ocre/10 border border-ocre/25 rounded-card px-4 py-2.5 font-body text-xs font-semibold text-brun">
                  🚚 Plus que <strong>{(20 - cartTotal).toFixed(2)} €</strong> pour la livraison gratuite
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-card px-4 py-2.5 font-body text-xs font-semibold text-emerald-700">
                  ✓ Livraison gratuite débloquée !
                </div>
              )}

              {/* Articles */}
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 bg-creme rounded-card p-3">
                  <Link to={`/produit/${product.slug}`} onClick={closeDrawer} className="shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/produit/${product.slug}`} onClick={closeDrawer}>
                      <p className="font-body text-sm font-semibold text-brun leading-snug line-clamp-2 hover:text-ocre transition-colors">
                        {product.name}
                      </p>
                    </Link>
                    <p className="font-body text-xs text-gris-chaud mt-0.5">{product.price} € / unité</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-sable rounded overflow-hidden bg-blanc-casse">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-brun hover:bg-sable transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 py-1 font-body text-xs font-semibold text-brun min-w-[1.75rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-brun hover:bg-sable transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm font-bold text-brun">
                          {(product.price * quantity).toFixed(2)} €
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-gris-chaud hover:text-terracotta transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec total et CTA */}
        {items.length > 0 && (
          <div className="border-t border-sable px-5 py-4 bg-blanc-casse shrink-0 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body font-semibold text-brun">Total</span>
              <span className="font-display text-2xl font-bold text-brun">{cartTotal.toFixed(2)} €</span>
            </div>
            <Button
              asChild
              className="w-full gap-2"
              size="lg"
              onClick={closeDrawer}
            >
              <Link to="/commande">
                Commander <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full"
              onClick={closeDrawer}
            >
              <Link to="/panier">Voir le panier complet</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
