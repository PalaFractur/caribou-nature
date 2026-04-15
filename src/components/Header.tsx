import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/logo-V1.jpg";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import SearchModal from "@/components/SearchModal";

const navLinks = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Idées cadeaux", href: "/idees-cadeaux" },
  { label: "Notre boutique", href: "/boutique" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const { user: session } = useAuth();
  const { cartCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();

  // Bounce badge when cart count changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 500);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-blanc-casse shadow-soft">
        <div className="container flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="Caribou Nature" className="h-16 md:h-18 object-contain" />
            <span className="text-xl md:text-2xl font-display font-semibold text-brun">
              Caribou Nature
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body font-semibold text-brun hover:text-ocre transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/quiz"
              className="font-body font-semibold text-brun hover:text-ocre transition-colors duration-200"
            >
              🎁 Quiz cadeau
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1">
            {/* Recherche */}
            <button
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-brun hover:text-ocre transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Mes favoris"
              className="hidden md:flex relative p-2 text-brun hover:text-ocre transition-colors"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terracotta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Mon compte */}
            <Link
              to={session ? "/mon-compte" : "/connexion"}
              aria-label="Mon compte"
              className="hidden md:flex p-2 text-brun hover:text-ocre transition-colors"
            >
              <User size={20} />
            </Link>

            {/* Panier */}
            <button
              aria-label="Ouvrir le panier"
              onClick={openDrawer}
              className="relative p-2 text-brun hover:text-ocre transition-colors"
            >
              <ShoppingCart size={20} />
              <span className={`absolute -top-0.5 -right-0.5 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold transition-colors ${cartCount > 0 ? "bg-ocre" : "bg-gris-chaud"} ${cartBounce ? "animate-bounce" : ""}`}>
                {cartCount}
              </span>
            </button>

            {/* Menu hamburger mobile */}
            <button
              aria-label="Menu"
              className="md:hidden p-2 text-brun"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-blanc-casse border-t border-border">
            <nav className="container py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body font-semibold text-brun hover:text-ocre text-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/quiz"
                className="font-body font-semibold text-brun hover:text-ocre text-lg"
                onClick={() => setMobileOpen(false)}
              >
                🎁 Quiz cadeau
              </Link>
              <div className="flex gap-4 pt-2 border-t border-border">
                <Link
                  to="/wishlist"
                  className="flex items-center gap-2 text-brun hover:text-ocre"
                  onClick={() => setMobileOpen(false)}
                >
                  <Heart size={18} />
                  Favoris
                  {wishlistCount > 0 && (
                    <span className="bg-terracotta text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  to={session ? "/mon-compte" : "/connexion"}
                  className="flex items-center gap-2 text-brun hover:text-ocre"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={18} />
                  {session ? `Mon compte` : "Connexion"}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
