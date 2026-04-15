import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getOrderBySessionId, type Order } from "@/lib/orders";
import { useMeta } from "@/hooks/useMeta";
import { Package, Truck, CheckCircle2, Home } from "lucide-react";

function formatEuro(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const TIMELINE_STEPS = [
  { label: "Commande reçue", icon: <CheckCircle2 size={20} />, done: true },
  { label: "En préparation", icon: <Package size={20} />, done: false },
  { label: "Prête / Expédiée", icon: <Truck size={20} />, done: false },
  { label: "Livrée", icon: <Home size={20} />, done: false },
];

export default function Confirmation() {
  useMeta({ title: "Commande confirmée — Caribou Nature" });
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!sessionId) {
      setLoading(false);
      return;
    }

    // Poll until order is confirmed (webhook may have a slight delay)
    let attempts = 0;
    const poll = async () => {
      const found = await getOrderBySessionId(sessionId);
      if (found) {
        setOrder(found);
        setLoading(false);
        return;
      }
      attempts++;
      if (attempts < 8) {
        setTimeout(poll, 1500);
      } else {
        setLoading(false);
      }
    };
    poll();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background page-transition">
      <TopBar />
      <Header />

      <section className="py-12 md:py-20">
        <div className="container max-w-3xl mx-auto">

          {/* Animated checkmark */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 mb-5 animate-scale-in">
              <CheckCircle2 size={52} className="text-emerald-500" />
            </div>
            <h1 className="text-3xl md:text-4xl mb-3">Merci pour votre commande !</h1>
            <p className="font-body text-gris-chaud text-lg">
              Votre commande a bien été enregistrée et sera traitée dans les meilleurs délais.
            </p>
            {order && (
              <p className="font-display text-xl font-semibold text-ocre mt-2">
                N° {order.id}
              </p>
            )}
          </div>

          {loading ? (
            <div className="bg-blanc-casse rounded-card shadow-card p-12 text-center">
              <div className="w-8 h-8 border-2 border-ocre/30 border-t-ocre rounded-full animate-spin mx-auto mb-4" />
              <p className="font-body text-gris-chaud">Confirmation du paiement en cours…</p>
            </div>
          ) : order ? (
            <div className="space-y-6">

              {/* Order summary table */}
              <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-sable/30">
                  <h2 className="text-xl">Récapitulatif de la commande</h2>
                  <p className="font-body text-sm text-gris-chaud mt-0.5">
                    Passée le {formatDate(order.date)}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-card object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-brun text-sm leading-snug">
                          {item.name}
                        </p>
                        <p className="font-body text-xs text-gris-chaud">
                          {formatEuro(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-body font-bold text-brun text-sm shrink-0">
                        {formatEuro(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="px-6 pb-6 border-t border-sable/30 pt-4 space-y-2">
                  <div className="flex justify-between font-body text-sm text-gris-chaud">
                    <span>Sous-total</span>
                    <span>{formatEuro(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between font-body text-sm text-emerald-600 font-semibold">
                      <span>Remise {order.promoCode ? `(${order.promoCode})` : ""}</span>
                      <span>- {formatEuro(order.discount)}</span>
                    </div>
                  )}
                  {order.giftWrapping && (
                    <div className="flex justify-between font-body text-sm text-emerald-600">
                      <span>Emballage cadeau</span>
                      <span className="font-semibold">Offert</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body text-sm text-gris-chaud">
                    <span>Livraison</span>
                    <span className={order.shipping === 0 ? "text-emerald-600 font-semibold" : "text-brun"}>
                      {order.shipping === 0 ? "Gratuite" : formatEuro(order.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-body text-base font-bold text-brun border-t border-sable pt-2">
                    <span>Total</span>
                    <span>{formatEuro(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-blanc-casse rounded-card shadow-card p-6">
                <h2 className="text-xl mb-4">Mode de livraison</h2>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-card bg-ocre/10 flex items-center justify-center shrink-0">
                    {order.livraison === "domicile" ? (
                      <Truck size={20} className="text-ocre" />
                    ) : (
                      <Home size={20} className="text-ocre" />
                    )}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-brun">
                      {order.livraison === "domicile" ? "Livraison à domicile" : "Click & Collect"}
                    </p>
                    {order.address ? (
                      <p className="font-body text-sm text-gris-chaud mt-0.5">{order.address}</p>
                    ) : (
                      <p className="font-body text-sm text-gris-chaud mt-0.5">
                        12 rue Saint-Amable, 63200 Riom — Prêt en 2h
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-blanc-casse rounded-card shadow-card p-6">
                <h2 className="text-xl mb-6">Suivi de votre commande</h2>
                <div className="flex items-start justify-between relative">
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-sable" />
                  {TIMELINE_STEPS.map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        step.done
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-blanc-casse border-sable text-gris-chaud"
                      }`}>
                        {step.icon}
                      </div>
                      <p className={`font-body text-xs text-center leading-tight ${
                        step.done ? "font-semibold text-emerald-600" : "text-gris-chaud"
                      }`}>
                        {step.label}
                        {step.done && <span className="block text-emerald-500">✓</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email confirmation notice */}
              <div className="bg-ocre/10 border border-ocre/30 rounded-card p-4">
                <p className="font-body text-sm text-brun">
                  📧 Un email de confirmation a été envoyé à <strong>{order.customer.email}</strong>
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button asChild size="lg">
                  <Link to="/catalogue">Continuer mes achats</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/mon-compte">Voir mes commandes</Link>
                </Button>
              </div>
            </div>
          ) : (
            /* Fallback — session not found yet */
            <div className="bg-blanc-casse rounded-card shadow-card p-10 text-center">
              <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl mb-3">Paiement reçu !</h2>
              <p className="font-body text-gris-chaud mb-6">
                Votre paiement a été validé. Vous recevrez un email de confirmation dans quelques instants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/catalogue">Continuer mes achats</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/mon-compte">Mon compte</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
