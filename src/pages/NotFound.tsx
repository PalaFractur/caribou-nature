import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

// Sélection de produits populaires (bien notés, en stock)
const suggestions = products
  .filter((p) => p.stock > 0 && p.isNew)
  .slice(0, 4)
  .concat(products.filter((p) => p.stock > 0 && !p.isNew).slice(0, 4))
  .slice(0, 4);

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <section className="py-20 md:py-28">
        <div className="container max-w-md mx-auto text-center mb-16">
          <span className="text-7xl block mb-6">🦌</span>
          <h1 className="text-5xl font-display font-bold text-brun mb-4">404</h1>
          <h2 className="text-xl mb-4">Cette page s'est perdue en forêt…</h2>
          <p className="font-body text-gris-chaud mb-8">
            La page que vous cherchez n'existe pas ou a été déplacée. Pas de panique, retournez à l'accueil !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/catalogue">Voir le catalogue</Link>
            </Button>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="container">
            <h3 className="font-display text-xl text-brun text-center mb-6">
              Peut-être cherchiez-vous…
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {suggestions.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
