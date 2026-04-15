import { useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlist";
import { useMeta } from "@/hooks/useMeta";
import { Heart, ArrowUpDown } from "lucide-react";

type SortOption = "default" | "prix-asc" | "prix-desc" | "nom-az";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Ordre d'ajout",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  "nom-az": "Nom A → Z",
};

export default function Wishlist() {
  const { items } = useWishlist();
  const [sort, setSort] = useState<SortOption>("default");

  useMeta({
    title: "Mes favoris — Caribou Nature",
    description: "Retrouvez tous les jouets et jeux que vous avez mis de côté.",
  });

  const sorted = [...items].sort((a, b) => {
    if (sort === "prix-asc") return a.price - b.price;
    if (sort === "prix-desc") return b.price - a.price;
    if (sort === "nom-az") return a.name.localeCompare(b.name, "fr");
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <div className="container py-4">
        <Breadcrumb crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Mes favoris" },
        ]} />
      </div>

      <section className="container pb-16">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl">Mes favoris</h1>
            {items.length > 0 && (
              <span className="bg-terracotta text-white text-sm font-semibold px-3 py-1 rounded-full font-body">
                {items.length}
              </span>
            )}
          </div>

          {items.length > 1 && (
            <div className="flex items-center gap-2">
              <ArrowUpDown size={15} className="text-gris-chaud shrink-0" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-9 px-3 rounded-btn border border-sable font-body text-sm bg-blanc-casse text-brun focus:outline-none focus:ring-2 focus:ring-ocre cursor-pointer"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <option key={key} value={key}>{SORT_LABELS[key]}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-blanc-casse rounded-card shadow-card p-16 text-center">
            <Heart size={56} className="text-sable mx-auto mb-4" />
            <h2 className="text-xl mb-3">Votre liste de favoris est vide</h2>
            <p className="font-body text-gris-chaud mb-6">
              Ajoutez des produits à vos favoris en cliquant sur le cœur sur les fiches produits
            </p>
            <Button asChild><Link to="/catalogue">Découvrir le catalogue</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
