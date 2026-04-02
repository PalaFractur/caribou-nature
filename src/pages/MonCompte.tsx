import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getSession, deconnecter, type User } from "@/lib/auth";
import { LogOut, User as UserIcon, ShoppingBag, Heart, MapPin, Star } from "lucide-react";

const commandesDemo = [
  { id: "#CN-2024-001", date: "15 mars 2024", statut: "Livré", total: "47,00 €", produits: "Puzzle ferme 36 pièces, Poussin sonore" },
  { id: "#CN-2024-002", date: "02 avril 2024", statut: "En préparation", total: "65,00 €", produits: "Circuit de billes 52 pièces" },
];

export default function MonCompte() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [onglet, setOnglet] = useState<"tableau-de-bord" | "commandes" | "infos">("tableau-de-bord");

  useEffect(() => {
    const session = getSession();
    if (!session) { navigate("/connexion"); return; }
    setUser(session);
  }, [navigate]);

  const handleDeconnexion = () => {
    deconnecter();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <section className="py-12 md:py-16">
        <div className="container">

          {/* En-tête */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-ocre/20 flex items-center justify-center text-2xl font-display font-bold text-ocre">
                {user.prenom[0]}{user.nom[0]}
              </div>
              <div>
                <h1 className="text-2xl">Bonjour, {user.prenom} 👋</h1>
                <p className="font-body text-sm text-gris-chaud">Membre depuis le {user.dateInscription}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleDeconnexion} className="gap-2 text-terracotta border-terracotta hover:bg-terracotta hover:text-white">
              <LogOut size={16} /> Se déconnecter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Menu latéral */}
            <nav className="md:col-span-1 space-y-1">
              {[
                { id: "tableau-de-bord", label: "Tableau de bord", icon: <UserIcon size={16} /> },
                { id: "commandes", label: "Mes commandes", icon: <ShoppingBag size={16} /> },
                { id: "infos", label: "Mes informations", icon: <UserIcon size={16} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setOnglet(item.id as typeof onglet)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-card font-body text-sm font-semibold transition-colors text-left ${
                    onglet === item.id
                      ? "bg-ocre text-white"
                      : "text-brun hover:bg-sable"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-sable mt-4">
                <Link to="/catalogue" className="w-full flex items-center gap-3 px-4 py-3 rounded-card font-body text-sm font-semibold text-brun hover:bg-sable transition-colors">
                  <Heart size={16} /> Continuer mes achats
                </Link>
              </div>
            </nav>

            {/* Contenu */}
            <div className="md:col-span-3">

              {/* Tableau de bord */}
              {onglet === "tableau-de-bord" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blanc-casse rounded-card p-6 shadow-card text-center">
                      <ShoppingBag size={28} className="text-ocre mx-auto mb-2" />
                      <p className="font-display text-2xl font-bold text-brun">2</p>
                      <p className="font-body text-sm text-gris-chaud">Commandes</p>
                    </div>
                    <div className="bg-blanc-casse rounded-card p-6 shadow-card text-center">
                      <Heart size={28} className="text-terracotta mx-auto mb-2" />
                      <p className="font-display text-2xl font-bold text-brun">0</p>
                      <p className="font-body text-sm text-gris-chaud">Favoris</p>
                    </div>
                    <div className="bg-blanc-casse rounded-card p-6 shadow-card text-center">
                      <Star size={28} className="text-ocre mx-auto mb-2" />
                      <p className="font-display text-2xl font-bold text-brun">0</p>
                      <p className="font-body text-sm text-gris-chaud">Avis laissés</p>
                    </div>
                  </div>

                  <div className="bg-blanc-casse rounded-card p-6 shadow-card">
                    <h3 className="mb-4">Dernière commande</h3>
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                      <div>
                        <p className="font-body font-semibold text-brun">{commandesDemo[0].id}</p>
                        <p className="font-body text-sm text-gris-chaud">{commandesDemo[0].produits}</p>
                        <p className="font-body text-xs text-gris-chaud mt-1">{commandesDemo[0].date}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full font-body">
                          {commandesDemo[0].statut}
                        </span>
                        <p className="font-body font-bold text-brun mt-2">{commandesDemo[0].total}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-ocre/10 border border-ocre/25 rounded-card p-5">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-ocre mt-0.5 shrink-0" />
                      <div>
                        <p className="font-body font-semibold text-brun mb-1">Boutique Caribou Nature</p>
                        <p className="font-body text-sm text-gris-chaud">12 rue Saint-Amable, 63200 Riom</p>
                        <p className="font-body text-sm text-gris-chaud">Mar–Ven 9h30–19h · Sam 9h30–19h</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Commandes */}
              {onglet === "commandes" && (
                <div className="space-y-4">
                  <h2 className="text-xl mb-4">Mes commandes</h2>
                  {commandesDemo.map((cmd) => (
                    <div key={cmd.id} className="bg-blanc-casse rounded-card p-6 shadow-card">
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div>
                          <p className="font-body font-bold text-brun">{cmd.id}</p>
                          <p className="font-body text-sm text-gris-chaud mt-1">{cmd.produits}</p>
                          <p className="font-body text-xs text-gris-chaud mt-1">Commandé le {cmd.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full font-body ${
                            cmd.statut === "Livré"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-ocre/20 text-ocre"
                          }`}>
                            {cmd.statut}
                          </span>
                          <p className="font-body font-bold text-brun mt-2">{cmd.total}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Informations */}
              {onglet === "infos" && (
                <div className="bg-blanc-casse rounded-card p-8 shadow-card">
                  <h2 className="text-xl mb-6">Mes informations</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-body text-xs text-gris-chaud uppercase tracking-wide mb-1">Prénom</p>
                        <p className="font-body font-semibold text-brun">{user.prenom}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-gris-chaud uppercase tracking-wide mb-1">Nom</p>
                        <p className="font-body font-semibold text-brun">{user.nom}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-body text-xs text-gris-chaud uppercase tracking-wide mb-1">Email</p>
                      <p className="font-body font-semibold text-brun">{user.email}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-gris-chaud uppercase tracking-wide mb-1">Membre depuis</p>
                      <p className="font-body font-semibold text-brun">{user.dateInscription}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-sable">
                    <p className="font-body text-sm text-gris-chaud italic">
                      Pour modifier vos informations, contactez-nous au <a href="tel:0473648055" className="text-ocre font-semibold">04 73 64 80 55</a> ou par <a href="/contact" className="text-ocre font-semibold">formulaire de contact</a>.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
