import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Scale } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useToast } from "@/hooks/use-toast";
import {
  getCompareList,
  addToCompare,
  removeFromCompare,
  isInCompare,
} from "@/lib/compare";

const ageLabel = (min: number, max: number) => {
  if (max >= 99) return "Tout âge";
  if (min === 0 && max <= 3) return `0-${max} ans`;
  return `${min}-${max} ans`;
};

const MAX_COMPARE = 3;

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  // Compare state (local, sync via custom event)
  const [inCompare, setInCompare] = useState(() => isInCompare(product.id));

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast({ title: `✓ ${product.name} ajouté au panier`, duration: 2500 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    toast({
      title: inWishlist ? `Retiré des favoris` : `❤️ Ajouté aux favoris`,
      duration: 2000,
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(product.id);
      setInCompare(false);
      window.dispatchEvent(new Event("compare-updated"));
    } else {
      const current = getCompareList();
      if (current.length >= MAX_COMPARE) {
        toast({
          title: "Comparateur plein",
          description: "Vous pouvez comparer jusqu'à 3 produits à la fois.",
          duration: 2500,
        });
        return;
      }
      addToCompare(product.id);
      setInCompare(true);
      window.dispatchEvent(new Event("compare-updated"));
    }
  };

  return (
    <Link
      to={`/produit/${product.slug}`}
      className="group bg-blanc-casse rounded-card shadow-card overflow-hidden transition-all duration-200 hover:shadow-soft hover:-translate-y-1 block"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={`${product.name} - Caribou Nature Riom`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          width={400}
          height={400}
        />
        {/* Age badge */}
        <span className="absolute top-3 left-3 bg-vert-sauge text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-btn">
          {ageLabel(product.ageMin, product.ageMax)}
        </span>
        {/* New badge */}
        {product.isNew && (
          <span className="absolute top-3 right-12 bg-ocre text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-btn">
            Nouveau ✨
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
          className={`absolute top-3 right-3 bg-blanc-casse/80 backdrop-blur-sm p-1.5 rounded-full transition-colors ${
            inWishlist ? "text-terracotta" : "text-brun hover:text-terracotta"
          }`}
        >
          <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
        </button>
        {/* Compare button */}
        <button
          onClick={handleCompare}
          aria-label={inCompare ? "Retirer de la comparaison" : "Ajouter à la comparaison"}
          className={`absolute bottom-12 right-3 bg-blanc-casse/80 backdrop-blur-sm p-1.5 rounded-full transition-colors ${
            inCompare ? "text-ocre" : "text-brun hover:text-ocre"
          }`}
        >
          <Scale size={14} />
        </button>
        {/* Add to cart overlay */}
        <button
          onClick={handleAddCart}
          className="absolute bottom-0 left-0 right-0 bg-ocre text-primary-foreground font-body font-semibold text-sm py-2.5 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
        >
          <ShoppingCart size={16} /> Ajouter au panier
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-display text-base text-brun leading-tight mb-1 line-clamp-2">{product.name}</h3>
        <p className="font-body font-semibold text-lg text-brun">{product.price} €</p>
      </div>
    </Link>
  );
};

export default ProductCard;
