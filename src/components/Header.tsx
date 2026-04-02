import { useState } from "react";
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/logo-V1.jpg";

const navLinks = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Idées cadeaux", href: "/idees-cadeaux" },
  { label: "Notre boutique", href: "/boutique" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-blanc-casse shadow-soft">
      <div className="container flex items-center justify-between h-16 md:h-20">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
  <img 
    src={logo} 
    alt="Caribou Nature" 
    className="h-16 md:h-18 object-contain"
  />
  
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
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button aria-label="Rechercher" className="p-2 text-brun hover:text-ocre transition-colors">
            <Search size={20} />
          </button>
          <button aria-label="Wishlist" className="hidden md:block p-2 text-brun hover:text-ocre transition-colors">
            <Heart size={20} />
          </button>
          <button aria-label="Mon compte" className="hidden md:block p-2 text-brun hover:text-ocre transition-colors">
            <User size={20} />
          </button>
          <button aria-label="Panier" className="relative p-2 text-brun hover:text-ocre transition-colors">
            <ShoppingCart size={20} />
            <span className="absolute -top-0.5 -right-0.5 bg-ocre text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
              0
            </span>
          </button>
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
            <div className="flex gap-4 pt-2 border-t border-border">
              <a href="/mon-compte/wishlist" className="flex items-center gap-2 text-brun hover:text-ocre">
                <Heart size={18} /> Wishlist
              </a>
              <a href="/mon-compte" className="flex items-center gap-2 text-brun hover:text-ocre">
                <User size={18} /> Mon compte
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;