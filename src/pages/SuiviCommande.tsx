import { useState } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useMeta } from "@/hooks/useMeta";
import { Search, Package, Truck, CheckCircle2, Home, Clock } from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "ready" | "shipped" | "delivered" | "cancelled";

interface OrderResult {
  id: string;
  status: OrderStatus;
  date: string;
  total: number;
  livraison: string;
  items: { name: string; quantity: number; price: number }[];
  customer: { prenom: string; nom: string; email: string };
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente de confirmation",
  confirmed: "Confirmée — en cours de préparation",
  ready: "Prête à récupérer / expédiée",
  shipped: "En cours de livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-orange-100 text-orange-800 border-orange-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const TIMELINE: { label: string; icon: React.ReactNode; statuses: OrderStatus[] }[] = [
  { label: "Commande reçue", icon: <CheckCircle2 size={18} />, statuses: ["pending", "confirmed", "ready", "shipped", "delivered"] },
  { label: "En préparation", icon: <Package size={18} />, statuses: ["confirmed", "ready", "shipped", "delivered"] },
  { label: "Prête / Expédiée", icon: <Truck size={18} />, statuses: ["ready", "shipped", "delivered"] },
  { label: "Livrée", icon: <Home size={18} />, statuses: ["delivered"] },
];

function formatEuro(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function SuiviCommande() {
  useMeta({
    title: "Suivi de commande — Caribou Nature",
    description: "Suivez l'état de votre commande Caribou Nature en entrant votre numéro de commande.",
  });

  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) {
      setError("Veuillez remplir le numéro de commande et l'email.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setSearched(false);

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId.trim().toUpperCase())
      .single();

    setSearched(true);
    setLoading(false);

    if (!data) {
      setError("Commande introuvable. Vérifiez le numéro et l'email.");
      return;
    }

    // Vérifier que l'email correspond
    const customer = data.customer as { email: string; prenom: string; nom: string };
    if (customer.email.toLowerCase() !== email.trim().toLowerCase()) {
      setError("Commande introuvable. Vérifiez le numéro et l'email.");
      return;
    }

    setResult({
      id: data.id,
      status: data.status as OrderStatus,
      date: data.date,
      total: Number(data.total),
      livraison: data.livraison,
      items: data.items as { name: string; quantity: number; price: number }[],
      customer,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <div className="container py-3">
        <Breadcrumb crumbs={[{ label: "Accueil", href: "/" }, { label: "Suivi de commande" }]} />
      </div>

      <section className="py-12 md:py-16">
        <div className="container max-w-2xl mx-auto">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ocre/15 mb-4">
              <Package size={32} className="text-ocre" />
            </div>
            <h1 className="text-3xl mb-2">Suivi de commande</h1>
            <p className="font-body text-gris-chaud">
              Entrez votre numéro de commande et l'email utilisé pour passer commande.
            </p>
          </div>

          <div className="bg-blanc-casse rounded-card shadow-card p-8 mb-8">
            <form onSubmit={handleSearch} noValidate className="space-y-4">
              <div>
                <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                  Numéro de commande <span className="text-terracotta">*</span>
                </label>
                <Input
                  value={orderId}
                  onChange={(e) => { setOrderId(e.target.value); setError(""); }}
                  placeholder="CN-2024-XXXX"
                  className="uppercase"
                />
              </div>
              <div>
                <label className="font-body text-sm font-semibold text-brun block mb-1.5">
                  Email de commande <span className="text-terracotta">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="votre@email.fr"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-card px-4 py-3">
                  <p className="font-body text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Recherche en cours…</>
                ) : (
                  <><Search size={16} /> Suivre ma commande</>
                )}
              </Button>
            </form>
          </div>

          {searched && result && (
            <div className="space-y-5">
              {/* Statut */}
              <div className={`rounded-card border-2 p-5 ${STATUS_CLASSES[result.status]}`}>
                <div className="flex items-center gap-3">
                  <Clock size={20} />
                  <div>
                    <p className="font-body font-bold text-sm">Commande {result.id}</p>
                    <p className="font-body text-sm mt-0.5">{STATUS_LABELS[result.status]}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {result.status !== "cancelled" && (
                <div className="bg-blanc-casse rounded-card shadow-card p-6">
                  <h2 className="font-display text-lg text-brun mb-5">Progression</h2>
                  <div className="flex items-start justify-between relative">
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-sable" />
                    {TIMELINE.map((step, i) => {
                      const done = step.statuses.includes(result.status);
                      return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${done ? "bg-emerald-500 border-emerald-500 text-white" : "bg-blanc-casse border-sable text-gris-chaud"}`}>
                            {step.icon}
                          </div>
                          <p className={`font-body text-xs text-center leading-tight ${done ? "font-semibold text-emerald-600" : "text-gris-chaud"}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Détails */}
              <div className="bg-blanc-casse rounded-card shadow-card p-6">
                <h2 className="font-display text-lg text-brun mb-4">Détails de la commande</h2>
                <div className="space-y-2 mb-4">
                  {result.items.map((item, i) => (
                    <div key={i} className="flex justify-between font-body text-sm">
                      <span className="text-brun">{item.name} × {item.quantity}</span>
                      <span className="font-semibold text-brun">{formatEuro(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-sable pt-3 flex justify-between font-body font-bold text-brun">
                  <span>Total</span>
                  <span>{formatEuro(result.total)}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-sable font-body text-sm text-gris-chaud space-y-1">
                  <p>Passée le {new Date(result.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                  <p>Mode : {result.livraison === "domicile" ? "Livraison à domicile" : "Click & Collect"}</p>
                </div>
              </div>

              <div className="bg-ocre/10 border border-ocre/25 rounded-card p-4 text-center">
                <p className="font-body text-sm text-brun">
                  Une question sur votre commande ?{" "}
                  <a href="tel:0473648055" className="text-ocre font-semibold hover:text-terracotta">04 73 64 80 55</a>
                  {" "}ou{" "}
                  <a href="/contact" className="text-ocre font-semibold hover:text-terracotta">contactez-nous</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
