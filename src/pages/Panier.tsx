import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

const LIVRAISON_OFFERTE_SEUIL = 20;

export default function Panier() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const livraisonGratuite = cartTotal >= LIVRAISON_OFFERTE_SEUIL;
  const reste = LIVRAISON_OFFERTE_SEUIL - cartTotal;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <div className="container py-4">
        <Breadcrumb crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Mon panier" },
        ]} />
      </div>

      <section className="container pb-16">
        <h1 className="text-3xl mb-8">Mon panier</h1>

        {items.length === 0 ? (
          <div className="bg-blanc-casse rounded-card shadow-card p-16 text-center">
            <ShoppingBag size={56} className="text-sable mx-auto mb-4" />
            <h2 className="text-xl mb-3">Votre panier est vide</h2>
            <p className="font-body text-gris-chaud mb-6">Découvrez notre sélection de jouets et jeux éducatifs</p>
            <Button asChild><Link to="/catalogue">Voir le catalogue</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Liste articles */}
            <div className="lg:col-span-2 space-y-4">
              {/* Barre livraison */}
              <div className={`rounded-card px-5 py-3 font-body text-sm font-semibold ${livraisonGratuite ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-ocre/10 text-brun border border-ocre/25"}`}>
                {livraisonGratuite
                  ? "✓ Livraison gratuite sur Riom-Limagne incluse !"
                  : `🚚 Plus que ${reste.toFixed(2)} € pour la livraison gratuite`}
              </div>

              {items.map(({ product, quantity }) => (
                <div key={product.id} className="bg-blanc-casse rounded-card shadow-card p-4 flex gap-4">
                  <Link to={`/produit/${product.slug}`} className="shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/produit/${product.slug}`}>
                      <h3 className="font-display text-base text-brun leading-snug hover:text-ocre transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-body text-sm text-gris-chaud mt-1">{product.category}</p>

                    <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
                      {/* Quantité */}
                      <div className="flex items-center border border-sable rounded-btn overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2.5 py-1.5 text-brun hover:bg-sable transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1.5 font-body font-semibold text-brun text-sm min-w-[2.5rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="px-2.5 py-1.5 text-brun hover:bg-sable transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Augmenter"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-body font-bold text-brun">
                          {(product.price * quantity).toFixed(2)} €
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          aria-label="Supprimer"
                          className="text-gris-chaud hover:text-terracotta transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link to="/catalogue" className="font-body text-sm text-ocre hover:text-terracotta font-semibold transition-colors">
                  ← Continuer mes achats
                </Link>
              </div>
            </div>

            {/* Résumé commande */}
            <div className="lg:col-span-1">
              <div className="bg-blanc-casse rounded-card shadow-card p-6 sticky top-28">
                <h2 className="text-xl mb-5">Résumé</h2>
                <div className="space-y-3 font-body text-sm mb-5">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between text-gris-chaud">
                      <span className="truncate pr-2">{product.name} × {quantity}</span>
                      <span className="shrink-0 font-semibold text-brun">{(product.price * quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                  <div className="border-t border-sable pt-3 flex justify-between text-gris-chaud">
                    <span>Livraison</span>
                    <span className={livraisonGratuite ? "text-emerald-600 font-semibold" : "text-brun font-semibold"}>
                      {livraisonGratuite ? "Gratuite" : "À calculer"}
                    </span>
                  </div>
                  <div className="border-t border-sable pt-3 flex justify-between">
                    <span className="font-bold text-brun text-base">Total</span>
                    <span className="font-bold text-brun text-xl">{cartTotal.toFixed(2)} €</span>
                  </div>
                </div>

                <Button asChild className="w-full gap-2" size="lg">
                  <Link to="/commande">Passer la commande <ArrowRight size={16} /></Link>
                </Button>

                <div className="mt-4 space-y-1.5">
                  {["Paiement 100% sécurisé", "Emballage cadeau offert", "Retours sous 14 jours"].map((item) => (
                    <p key={item} className="font-body text-xs text-gris-chaud flex items-center gap-1.5">
                      <span className="text-vert-sauge">✓</span> {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
