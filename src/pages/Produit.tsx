import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import ImageLightbox from "@/components/ImageLightbox";
import JsonLd from "@/components/JsonLd";
import Confetti from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { getReviews, getAverageRating } from "@/data/reviews";
import { getUserReviews, saveUserReview } from "@/lib/userReviews";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useMeta } from "@/hooks/useMeta";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import {
  ShoppingCart, Heart, Minus, Plus, CheckCircle,
  Truck, Gift, RotateCcw, Star, Share2, ZoomIn,
} from "lucide-react";

const ageLabel = (min: number, max: number) => {
  if (max >= 99) return "Tout âge";
  if (min === 0) return `0-${max} ans`;
  return `${min}-${max} ans`;
};

function buildGallery(mainImage: string): string[] {
  const base = mainImage.split("?")[0];
  return [`${base}?w=600&h=600&fit=crop&fm=webp&q=80`];
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= rating ? "text-ocre fill-ocre" : "text-sable fill-sable"} />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${i} étoile${i > 1 ? "s" : ""}`}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={
              i <= (hovered || value)
                ? "text-ocre fill-ocre"
                : "text-sable fill-sable"
            }
          />
        </button>
      ))}
    </div>
  );
}

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function Produit() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [userReviews, setUserReviews] = useState<import("@/lib/userReviews").UserReview[]>([]);

  useEffect(() => {
    if (product) getUserReviews(product.slug).then(setUserReviews);
  }, [product?.slug]);

  const staticReviews = product ? getReviews(product.slug) : [];
  const allReviews = [...userReviews, ...staticReviews];

  // Recompute average from all reviews
  const computedAvg =
    allReviews.length > 0
      ? Math.round((allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length) * 10) / 10
      : product ? getAverageRating(product.slug) : 0;

  const gallery = product ? buildGallery(product.image) : [];
  const recentlyViewed = useRecentlyViewed(product?.slug);

  // Sticky add to cart — observe the main button
  const addToCartBtnRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = addToCartBtnRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useMeta({
    title: product ? `${product.name} — Caribou Nature` : "Produit introuvable",
    description: product?.description,
    image: product?.image,
    url: product ? `/produit/${product.slug}` : undefined,
  });

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><Header />
        <section className="py-24 text-center">
          <span className="text-6xl block mb-4">🦌</span>
          <h1 className="text-2xl mb-4">Produit introuvable</h1>
          <Button asChild><Link to="/catalogue">Retour au catalogue</Link></Button>
        </section>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleShare = async () => {
    const data = {
      title: product.name,
      text: `${product.name} — ${product.price} € chez Caribou Nature à Riom`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* annulé */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    setShowConfetti(true);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 300);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");

    if (reviewRating === 0) {
      setReviewError("Veuillez sélectionner une note.");
      return;
    }
    if (!reviewAuthor.trim()) {
      setReviewError("Veuillez indiquer votre prénom.");
      return;
    }
    if (reviewComment.trim().length < 10) {
      setReviewError("Votre commentaire doit contenir au moins 10 caractères.");
      return;
    }
    if (reviewComment.trim().length > 500) {
      setReviewError("Votre commentaire ne doit pas dépasser 500 caractères.");
      return;
    }

    const review = {
      slug: product.slug,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString(),
    };
    saveUserReview(review);
    setUserReviews(getUserReviews(product.slug));
    setReviewSuccess(true);
    setReviewRating(0);
    setReviewAuthor("");
    setReviewComment("");
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: String(product.id),
    brand: { "@type": "Brand", name: "Caribou Nature" },
    offers: {
      "@type": "Offer",
      url: `https://caribounature-riom.fr/produit/${product.slug}`,
      priceCurrency: "EUR",
      price: product.price,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Caribou Nature" },
    },
    ...(allReviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: computedAvg,
        reviewCount: allReviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://caribounature-riom.fr/" },
      { "@type": "ListItem", position: 2, name: "Catalogue", item: "https://caribounature-riom.fr/catalogue" },
      { "@type": "ListItem", position: 3, name: product.category, item: `https://caribounature-riom.fr/catalogue?cat=${encodeURIComponent(product.category)}` },
      { "@type": "ListItem", position: 4, name: product.name, item: `https://caribounature-riom.fr/produit/${product.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background page-transition">
      <JsonLd id={`product-${product.slug}`} data={productSchema} />
      <JsonLd id={`breadcrumb-${product.slug}`} data={breadcrumbSchema} />

      {/* Confetti */}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      <TopBar />
      <Header />

      <div className="container py-4">
        <Breadcrumb crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue", href: "/catalogue" },
          { label: product.category, href: `/catalogue?cat=${encodeURIComponent(product.category)}` },
          { label: product.name },
        ]} />
      </div>

      {/* Produit */}
      <section className="container pb-12 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Galerie */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-card overflow-hidden shadow-card bg-blanc-casse group cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}>
              <img
                src={gallery[activeImg]}
                alt={`${product.name} — vue ${activeImg + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={600} height={600}
              />
              <div className="absolute inset-0 bg-brun/0 group-hover:bg-brun/10 transition-colors flex items-center justify-center">
                <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" />
              </div>
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-ocre text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-btn">
                  Nouveau ✨
                </span>
              )}
            </div>
            {/* Vignettes */}
            <div className="flex gap-3">
              {gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-1 aspect-square rounded-md overflow-hidden border-2 transition-all duration-150 ${activeImg === i ? "border-ocre shadow-md" : "border-sable hover:border-ocre/50"}`}
                  aria-label={`Vue ${i + 1}`}>
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <span className="bg-vert-sauge/20 text-vert-sauge border border-vert-sauge/30 text-xs font-semibold px-3 py-1 rounded-full font-body">
                {ageLabel(product.ageMin, product.ageMax)}
              </span>
              <span className="bg-sable text-brun text-xs font-semibold px-3 py-1 rounded-full font-body">
                {product.category}
              </span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="bg-terracotta/15 text-terracotta text-xs font-semibold px-3 py-1 rounded-full font-body">
                  Plus que {product.stock} en stock !
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl md:text-4xl leading-tight flex-1">{product.name}</h1>
              <button onClick={handleShare} aria-label="Partager ce produit"
                className="p-2 text-gris-chaud hover:text-ocre transition-colors shrink-0 mt-1">
                <Share2 size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(computedAvg)} />
              <span className="font-body text-sm font-semibold text-brun">{computedAvg}/5</span>
              <a href="#avis" className="font-body text-sm text-gris-chaud hover:text-ocre transition-colors">
                ({allReviews.length} avis)
              </a>
            </div>

            <p className="font-display text-3xl font-bold text-brun">{product.price} €</p>
            <p className="font-body text-gris-chaud leading-relaxed">{product.description}</p>

            {/* Quantité */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="font-body text-sm font-semibold text-brun">Quantité</span>
                <div className="flex items-center border border-sable rounded-btn overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-brun hover:bg-sable transition-colors" aria-label="Diminuer"><Minus size={16} /></button>
                  <span className="px-4 py-2 font-body font-semibold text-brun min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-brun hover:bg-sable transition-colors" aria-label="Augmenter"><Plus size={16} /></button>
                </div>
                <span className="font-body text-xs text-gris-chaud">{product.stock} disponibles</span>
              </div>

              {/* Observe this div for sticky bar */}
              <div ref={addToCartBtnRef} className="flex gap-3">
                <Button onClick={handleAddToCart} className="flex-1 gap-2" size="lg">
                  <ShoppingCart size={18} /> Ajouter au panier
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleWishlist}
                  className={`px-4 ${inWishlist ? "text-terracotta border-terracotta" : ""}`}
                  aria-label="Favoris"
                >
                  <Heart
                    size={18}
                    fill={inWishlist ? "currentColor" : "none"}
                    className={`transition-transform duration-200 ${heartPulse ? "scale-125" : "scale-100"}`}
                  />
                </Button>
              </div>
            </div>

            {/* Réassurance */}
            <div className="border-t border-sable pt-4 space-y-2">
              {[
                { icon: <Truck size={16} />, text: "Livraison gratuite dès 20 € sur Riom-Limagne" },
                { icon: <Gift size={16} />, text: "Emballage cadeau offert" },
                { icon: <RotateCcw size={16} />, text: "Retours acceptés sous 14 jours" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 font-body text-sm text-gris-chaud">
                  <span className="text-ocre">{item.icon}</span>{item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Caractéristiques */}
      <section className="bg-blanc-casse py-10 md:py-14">
        <div className="container max-w-3xl">
          <h2 className="text-2xl mb-6">Caractéristiques</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-3 font-body text-brun">
                <CheckCircle size={18} className="text-vert-sauge shrink-0 mt-0.5" />{detail}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Avis */}
      <section id="avis" className="container py-12 md:py-16 max-w-4xl">
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <h2 className="text-2xl">Avis clients</h2>
          <div className="flex items-center gap-2 bg-blanc-casse border border-sable rounded-card px-4 py-2 shadow-card">
            <StarRating rating={Math.round(computedAvg)} size={18} />
            <span className="font-display text-xl font-bold text-brun">{computedAvg}</span>
            <span className="font-body text-sm text-gris-chaud">/ 5 · {allReviews.length} avis</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {allReviews.map((review, i) => (
            <div key={i} className="bg-blanc-casse rounded-card shadow-card p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <StarRating rating={review.rating} size={14} />
                <span className="font-body text-xs text-gris-chaud">
                  {"date" in review && typeof review.date === "string" && review.date.length > 10
                    ? formatReviewDate(review.date)
                    : review.date}
                </span>
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed flex-1">"{review.comment}"</p>
              <p className="font-body text-xs font-semibold text-brun">— {review.author}</p>
            </div>
          ))}
        </div>

        {/* Laisser un avis */}
        <div className="bg-blanc-casse rounded-card shadow-card p-6 md:p-8">
          <h3 className="text-xl mb-5">Laisser un avis</h3>
          {reviewSuccess ? (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-card p-4">
              <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-body font-semibold text-emerald-700">Merci pour votre avis !</p>
                <p className="font-body text-sm text-emerald-600 mt-0.5">Votre avis a été publié avec succès.</p>
                <button
                  className="font-body text-xs text-ocre hover:text-terracotta underline mt-2"
                  onClick={() => setReviewSuccess(false)}
                >
                  Laisser un autre avis
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star picker */}
              <div>
                <label className="font-body text-sm font-semibold text-brun block mb-2">
                  Votre note <span className="text-terracotta">*</span>
                </label>
                <StarPicker value={reviewRating} onChange={setReviewRating} />
              </div>

              {/* Prénom */}
              <div>
                <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                  Prénom <span className="text-terracotta">*</span>
                </label>
                <input
                  type="text"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="Marie"
                  className="w-full h-10 px-3 rounded-btn border border-sable font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ocre focus:border-transparent transition-colors"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                  Commentaire <span className="text-terracotta">*</span>
                  <span className="font-normal text-gris-chaud ml-1">(10–500 caractères)</span>
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit…"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-btn border border-sable font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ocre focus:border-transparent transition-colors resize-none"
                />
                <p className="font-body text-xs text-gris-chaud mt-1 text-right">
                  {reviewComment.length}/500
                </p>
              </div>

              {reviewError && (
                <p className="font-body text-sm text-terracotta">{reviewError}</p>
              )}

              <Button type="submit" className="gap-2">
                <Star size={16} /> Publier mon avis
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Produits similaires */}
      {related.length > 0 && (
        <section className="bg-sable py-12 md:py-16">
          <div className="container">
            <h2 className="text-2xl mb-8">Dans la même catégorie</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Récemment consultés */}
      {recentlyViewed.length > 0 && (
        <section className="container py-12 md:py-16">
          <h2 className="text-2xl mb-8">Récemment consultés</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recentlyViewed.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <Footer />

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={gallery}
          activeIndex={activeImg}
          alt={product.name}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)}
          onNext={() => setActiveImg((i) => (i + 1) % gallery.length)}
        />
      )}

      {/* Sticky bottom bar — mobile only */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-blanc-casse border-t border-sable shadow-card transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm font-semibold text-brun truncate">{product.name}</p>
            <p className="font-display text-base font-bold text-brun">{product.price} €</p>
          </div>
          <Button onClick={handleAddToCart} className="gap-1.5 shrink-0" size="sm">
            <ShoppingCart size={15} /> Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
}
