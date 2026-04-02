import { Facebook, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-brun text-creme">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-display text-creme mb-3">🍃 Caribou Nature</h3>
          <p className="font-body text-sable text-sm">Le jouet juste, pour chaque enfant.</p>
          <div className="flex gap-3 mt-4">
            <a href="https://www.facebook.com/Caribounature/?locale=fr_FR" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-sable hover:text-ocre transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/caribou.nature/?hl=fr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-sable hover:text-ocre transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Catalogue */}
        <div>
          <h4 className="font-display text-lg text-creme mb-3">Catalogue</h4>
          <ul className="space-y-2 text-sm font-body text-sable">
            <li><a href="/catalogue" className="hover:text-ocre transition-colors">Tous les jouets</a></li>
            <li><a href="/idees-cadeaux" className="hover:text-ocre transition-colors">Idées cadeaux</a></li>
            <li><a href="/catalogue?new=true" className="hover:text-ocre transition-colors">Nouveautés</a></li>
          </ul>
        </div>

        {/* Mon compte */}
        <div>
          <h4 className="font-display text-lg text-creme mb-3">Mon compte</h4>
          <ul className="space-y-2 text-sm font-body text-sable">
            <li><a href="/mon-compte" className="hover:text-ocre transition-colors">Se connecter</a></li>
            <li><a href="/mon-compte/commandes" className="hover:text-ocre transition-colors">Mes commandes</a></li>
            <li><a href="/mon-compte/wishlist" className="hover:text-ocre transition-colors">Ma wishlist</a></li>
          </ul>
        </div>

        {/* La boutique */}
        <div>
          <h4 className="font-display text-lg text-creme mb-3">La boutique</h4>
          <ul className="space-y-2 text-sm font-body text-sable">
            <li><a href="/boutique" className="hover:text-ocre transition-colors">Notre histoire</a></li>
            <li><a href="/contact" className="hover:text-ocre transition-colors">Contact</a></li>
            <li><a href="tel:0473648055" className="hover:text-ocre transition-colors">04 73 64 80 55</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sable/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body text-sable">
        <p>© 2025 Caribou Nature · 12 rue Saint-Amable, 63200 Riom</p>
        <div className="flex gap-4">
          <a href="/cgv" className="hover:text-ocre transition-colors">CGV</a>
          <a href="/mentions-legales" className="hover:text-ocre transition-colors">Mentions légales</a>
          <a href="/politique-de-confidentialite" className="hover:text-ocre transition-colors">Confidentialité</a>
          <a href="/cookies" className="hover:text-ocre transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
