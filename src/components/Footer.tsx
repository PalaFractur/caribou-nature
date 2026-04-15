import { useState } from "react";

const IconFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from("newsletter_subscribers").upsert({ email }, { onConflict: "email" });
    } catch {
      // silent — don't block UX on errors
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <div className="border-t border-sable/20 pt-8 mb-8">
      <div className="max-w-lg mx-auto text-center">
        <h3 className="font-display text-lg text-creme mb-1">Restez informés</h3>
        <p className="font-body text-sm text-sable mb-4">
          Nouveautés, promotions et conseils cadeaux — directement dans votre boîte mail.
        </p>
        {status === "success" ? (
          <div className="bg-emerald-800/40 border border-emerald-600/40 rounded-card px-5 py-3">
            <p className="font-body text-sm text-emerald-300 font-semibold">✓ Merci ! Vous êtes bien inscrit(e).</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex gap-2">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder="votre@email.fr"
                aria-label="Votre adresse email"
                className={`w-full h-10 rounded-btn px-4 font-body text-sm bg-white/10 text-creme placeholder:text-sable/60 border focus:outline-none focus:ring-2 focus:ring-ocre transition-colors ${
                  status === "error" ? "border-terracotta" : "border-sable/30 hover:border-sable/60"
                }`}
              />
              {status === "error" && (
                <p className="font-body text-xs text-terracotta mt-1 text-left">Veuillez saisir un email valide.</p>
              )}
            </div>
            <button
              type="submit"
              className="h-10 px-5 bg-ocre hover:bg-terracotta text-white font-body font-semibold text-sm rounded-btn transition-colors shrink-0"
            >
              S'inscrire
            </button>
          </form>
        )}
        <p className="font-body text-xs text-sable/50 mt-2">
          Pas de spam. Désinscription en un clic. Conformément au RGPD.
        </p>
      </div>
    </div>
  );
}

const Footer = () => (
  <footer className="bg-brun text-creme">
    <div className="container py-12">

      <Newsletter />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-display text-creme mb-3">🍃 Caribou Nature</h3>
          <p className="font-body text-sable text-sm mb-3">Le jouet juste, pour chaque enfant.</p>
          <p className="font-body text-xs text-sable/70">12 rue Saint-Amable<br />63200 Riom · Puy-de-Dôme</p>
          <div className="flex gap-3 mt-4">
            <a href="https://www.facebook.com/Caribounature/?locale=fr_FR" target="_blank" rel="noopener noreferrer" aria-label="Facebook Caribou Nature" className="text-sable hover:text-ocre transition-colors">
              <IconFacebook />
            </a>
            <a href="https://www.instagram.com/caribou.nature/?hl=fr" target="_blank" rel="noopener noreferrer" aria-label="Instagram Caribou Nature" className="text-sable hover:text-ocre transition-colors">
              <IconInstagram />
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
            <li><a href="/panier" className="hover:text-ocre transition-colors">Mon panier</a></li>
          </ul>
        </div>

        {/* Mon compte */}
        <div>
          <h4 className="font-display text-lg text-creme mb-3">Mon compte</h4>
          <ul className="space-y-2 text-sm font-body text-sable">
            <li><a href="/connexion" className="hover:text-ocre transition-colors">Se connecter</a></li>
            <li><a href="/inscription" className="hover:text-ocre transition-colors">Créer un compte</a></li>
            <li><a href="/mon-compte" className="hover:text-ocre transition-colors">Mes commandes</a></li>
            <li><a href="/suivi-commande" className="hover:text-ocre transition-colors">Suivi de commande</a></li>
            <li><a href="/wishlist" className="hover:text-ocre transition-colors">Ma wishlist</a></li>
          </ul>
        </div>

        {/* La boutique */}
        <div>
          <h4 className="font-display text-lg text-creme mb-3">La boutique</h4>
          <ul className="space-y-2 text-sm font-body text-sable">
            <li><a href="/boutique" className="hover:text-ocre transition-colors">Notre histoire</a></li>
            <li><a href="/contact" className="hover:text-ocre transition-colors">Contactez-nous</a></li>
            <li><a href="tel:0473648055" className="hover:text-ocre transition-colors">04 73 64 80 55</a></li>
            <li><a href="mailto:caribounature@gmail.com" className="hover:text-ocre transition-colors">caribounature@gmail.com</a></li>
          </ul>
        </div>
      </div>

      {/* Réassurance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 py-6 border-t border-b border-sable/20">
        {[
          { icon: "🚚", text: "Livraison gratuite dès 20 €" },
          { icon: "🎁", text: "Emballage cadeau offert" },
          { icon: "🏪", text: "Click & Collect en 2h" },
          { icon: "↩️", text: "Retours sous 14 jours" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2">
            <span className="text-xl shrink-0">{item.icon}</span>
            <span className="font-body text-xs text-sable">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body text-sable">
        <p>© {new Date().getFullYear()} Caribou Nature · 12 rue Saint-Amable, 63200 Riom</p>
        <div className="flex flex-wrap justify-center gap-4">
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
