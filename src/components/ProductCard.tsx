import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const ageLabel = (min: number, max: number) => {
  if (max >= 99) return "Tout âge";
  if (min === 0 && max <= 3) return `0-${max} ans`;
  return `${min}-${max} ans`;
};

const ProductCard = ({ product }: { product: Product }) => {
  const { toast } = useToast();

  const handleAddCart = () => {
    toast({
      title: `✓ ${product.name} ajouté au panier`,
      duration: 2500,
    });
  };

  return (
    <div className="group bg-blanc-casse rounded-card shadow-card overflow-hidden transition-all duration-200 hover:shadow-soft hover:-translate-y-1">
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
          aria-label="Ajouter à la wishlist"
          className="absolute top-3 right-3 bg-blanc-casse/80 backdrop-blur-sm p-1.5 rounded-full text-brun hover:text-ocre transition-colors"
        >
          <Heart size={16} />
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
    </div>
  );
};

export default ProductCard;
