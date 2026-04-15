import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";
import { getOrdersByUser, type Order, type OrderStatus } from "@/lib/orders";
import { LogOut, User as UserIcon, ShoppingBag, Heart, MapPin, Star } from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  ready: "Prête",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  ready: "bg-purple-100 text-purple-800",
  shipped: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatEuro(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function MonCompte() {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [onglet, setOnglet] = useState<"tableau-de-bord" | "commandes" | "infos">("tableau-de-bord");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/connexion");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      getOrdersByUser(user.id).then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      });
    }
  }, [user]);

  const handleDeconnexion = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !user) return null;

  const prenom = profile?.prenom || user.email?.split("@")[0] || "Client";
  const nom = profile?.nom || "";
  const initiales = `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase();
  const dateInscription = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("fr-FR")
    : "—";

  const lastOrder = orders[0] || null;

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
                {initiales || "🦌"}
              </div>
              <div>
                <h1 className="text-2xl">Bonjour, {prenom} 👋</h1>
                <p className="font-body text-sm text-gris-chaud">Membre depuis le {dateInscription}</p>
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
                    onglet === item.id ? "bg-ocre text-white" : "text-brun hover:bg-sable"
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
                      <p className="font-display text-2xl font-bold text-brun">{orders.length}</p>
                      <p className="font-body text-sm text-gris-chaud">Commandes</p>
                    </div>
                    <div className="bg-blanc-casse rounded-card p-6 shadow-card text-center">
                      <Heart size={28} className="text-terracotta mx-auto mb-2" />
                      <p className="font-display text-2xl font-bold text-brun">{wishlistCount}</p>
                      <p className="font-body text-sm text-gris-chaud">Favoris</p>
                    </div>
                    <div className="bg-blanc-casse rounded-card p-6 shadow-card text-center">
                      <Star size={28} className="text-ocre mx-auto mb-2" />
                      <p className="font-display text-2xl font-bold text-brun">0</p>
                      <p className="font-body text-sm text-gris-chaud">Avis laissés</p>
                    </div>
                  </div>

                  {lastOrder ? (
                    <div className="bg-blanc-casse rounded-card p-6 shadow-card">
                      <h3 className="mb-4">Dernière commande</h3>
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div>
                          <p className="font-body font-semibold text-brun">{lastOrder.id}</p>
                          <p className="font-body text-sm text-gris-chaud">
                            {lastOrder.items.map((i) => i.name).join(", ")}
                          </p>
                          <p className="font-body text-xs text-gris-chaud mt-1">
                            {new Date(lastOrder.date).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full font-body ${STATUS_CLASSES[lastOrder.status]}`}>
                            {STATUS_LABELS[lastOrder.status]}
                          </span>
                          <p className="font-body font-bold text-brun mt-2">{formatEuro(lastOrder.total)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blanc-casse rounded-card p-6 shadow-card text-center">
                      <p className="font-body text-sm text-gris-chaud">Aucune commande pour le moment.</p>
                      <Link to="/catalogue" className="inline-block mt-3 text-sm text-ocre font-semibold hover:text-terracotta transition-colors">
                        Découvrir notre catalogue →
                      </Link>
                    </div>
                  )}

                  <div className="bg-ocre/10 border border-ocre/25 rounded-card p-5">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-ocre mt-0.5 shrink-0" />
                      <div>
                        <p className="font-body font-semibold text-brun mb-1">Boutique Caribou Nature</p>
                        <p className="font-body text-sm text-gris-chaud">12 rue Saint-Amable, 63200 Riom</p>
                        <p className="font-body text-sm text-gris-chaud">Mar–Sam 10h–12h30 et 14h–19h</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Commandes */}
              {onglet === "commandes" && (
                <div className="space-y-4">
                  <h2 className="text-xl mb-4">Mes commandes</h2>
                  {ordersLoading ? (
                    <div className="bg-blanc-casse rounded-card p-8 shadow-card text-center">
                      <div className="w-6 h-6 border-2 border-ocre/30 border-t-ocre rounded-full animate-spin mx-auto" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-blanc-casse rounded-card p-8 shadow-card text-center">
                      <p className="font-body text-gris-chaud">Aucune commande pour le moment.</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-blanc-casse rounded-card p-6 shadow-card">
                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                          <div>
                            <p className="font-body font-bold text-brun">{order.id}</p>
                            <p className="font-body text-sm text-gris-chaud mt-1">
                              {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                            </p>
                            <p className="font-body text-xs text-gris-chaud mt-1">
                              Commandé le {new Date(order.date).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full font-body ${STATUS_CLASSES[order.status]}`}>
                              {STATUS_LABELS[order.status]}
                            </span>
                            <p className="font-body font-bold text-brun mt-2">{formatEuro(order.total)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                        <p className="font-body font-semibold text-brun">{profile?.prenom || "—"}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-gris-chaud uppercase tracking-wide mb-1">Nom</p>
                        <p className="font-body font-semibold text-brun">{profile?.nom || "—"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-body text-xs text-gris-chaud uppercase tracking-wide mb-1">Email</p>
                      <p className="font-body font-semibold text-brun">{user.email}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-gris-chaud uppercase tracking-wide mb-1">Membre depuis</p>
                      <p className="font-body font-semibold text-brun">{dateInscription}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-sable">
                    <p className="font-body text-sm text-gris-chaud italic">
                      Pour modifier vos informations, contactez-nous au{" "}
                      <a href="tel:0473648055" className="text-ocre font-semibold">04 73 64 80 55</a>{" "}
                      ou par{" "}
                      <a href="/contact" className="text-ocre font-semibold">formulaire de contact</a>.
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
