import { useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { getPromoCodes } from "@/lib/promoCodes";
import { Truck, Store, Lock, Gift, Tag, CheckCircle, X, CreditCard } from "lucide-react";

type Livraison = "domicile" | "click-collect";

interface Form {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
}

type PromoType = "percent" | "fixed";
interface PromoCode {
  type: PromoType;
  value: number;
  label: string;
}

function applyPromo(subtotal: number, promo: PromoCode | null): number {
  if (!promo) return 0;
  if (promo.type === "percent") return subtotal * (promo.value / 100);
  return Math.min(promo.value, subtotal);
}

export default function Commande() {
  const { items, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();

  const [livraison, setLivraison] = useState<Livraison>("domicile");
  const [form, setForm] = useState<Form>({
    prenom: profile?.prenom || "",
    nom: profile?.nom || "",
    email: user?.email || "",
    telephone: profile?.telephone || "",
    adresse: "", ville: "", codePostal: "",
  });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState("");

  // Emballage cadeau
  const [giftWrapping, setGiftWrapping] = useState(false);

  // Code promo
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<PromoCode | null>(null);
  const [appliedCode, setAppliedCode] = useState<string>("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar /><Header />
        <section className="py-24 text-center">
          <h1 className="text-2xl mb-4">Votre panier est vide</h1>
          <Button asChild><Link to="/catalogue">Voir le catalogue</Link></Button>
        </section>
        <Footer />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e: Partial<Form> = {};
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.telephone.trim()) e.telephone = "Requis";
    if (livraison === "domicile") {
      if (!form.adresse.trim()) e.adresse = "Requis";
      if (!form.ville.trim()) e.ville = "Requis";
      if (!form.codePostal.trim()) {
        e.codePostal = "Requis";
      } else if (!/^\d{5}$/.test(form.codePostal.trim())) {
        e.codePostal = "Code postal invalide (5 chiffres)";
      }
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setPayError("");

    const address = livraison === "domicile"
      ? `${form.adresse}, ${form.codePostal} ${form.ville}`
      : undefined;

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            prenom: form.prenom,
            nom: form.nom,
            email: form.email,
            telephone: form.telephone,
          },
          livraison,
          address,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
          })),
          subtotal: cartTotal,
          discount,
          shipping: fraisLivraison,
          total,
          giftWrapping,
          promoCode: appliedCode || null,
          userId: user?.id || null,
          successUrl: `${window.location.origin}/confirmation`,
          cancelUrl: `${window.location.origin}/commande`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Erreur lors de la création du paiement.");
      }

      clearCart();
      window.location.href = data.url;
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setLoading(false);
    }
  };

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const allCodes = await getPromoCodes();
    const found = allCodes.find((c) => c.code === code && c.active);

    if (found) {
      const promo: PromoCode = { type: found.type, value: found.value, label: found.label };
      setPromoApplied(promo);
      setAppliedCode(code);
      setPromoError("");
      setPromoSuccess(`Code "${code}" appliqué : ${found.label}`);
    } else {
      setPromoApplied(null);
      setAppliedCode("");
      setPromoSuccess("");
      setPromoError("Code promo invalide ou expiré.");
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setAppliedCode("");
    setPromoInput("");
    setPromoError("");
    setPromoSuccess("");
  };

  const fraisLivraison = livraison === "click-collect" ? 0 : (cartTotal >= 20 ? 0 : 4.90);
  const discount = applyPromo(cartTotal, promoApplied);
  const total = Math.max(0, cartTotal - discount + fraisLivraison);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <div className="container py-4">
        <Breadcrumb crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Panier", href: "/panier" },
          { label: "Commande" },
        ]} />
      </div>

      <section className="container pb-16">
        <h1 className="text-3xl mb-8">Finaliser ma commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 space-y-6">

            {/* Livraison */}
            <div className="bg-blanc-casse rounded-card shadow-card p-6">
              <h2 className="text-xl mb-4">Mode de livraison</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { id: "domicile", icon: <Truck size={22} />, label: "Livraison à domicile", sub: "Gratuite dès 20 € · Sinon 4,90 €" },
                  { id: "click-collect", icon: <Store size={22} />, label: "Click & Collect", sub: "Prêt en 2h · Gratuit · 12 rue Saint-Amable, Riom" },
                ] as const).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLivraison(opt.id)}
                    className={`flex items-start gap-4 p-4 rounded-card border-2 text-left transition-colors ${
                      livraison === opt.id ? "border-ocre bg-ocre/5" : "border-sable hover:border-ocre/50"
                    }`}
                  >
                    <span className={livraison === opt.id ? "text-ocre" : "text-gris-chaud"}>{opt.icon}</span>
                    <div>
                      <p className="font-body font-semibold text-brun">{opt.label}</p>
                      <p className="font-body text-xs text-gris-chaud mt-0.5">{opt.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Emballage cadeau */}
            <div className="bg-blanc-casse rounded-card shadow-card p-6">
              <h2 className="text-xl mb-4">Options</h2>
              <button
                type="button"
                onClick={() => setGiftWrapping((v) => !v)}
                className={`w-full flex items-center gap-4 p-4 rounded-card border-2 text-left transition-colors ${
                  giftWrapping ? "border-ocre bg-ocre/5" : "border-sable hover:border-ocre/50"
                }`}
              >
                <span className={`shrink-0 ${giftWrapping ? "text-ocre" : "text-gris-chaud"}`}>
                  <Gift size={22} />
                </span>
                <div className="flex-1">
                  <p className="font-body font-semibold text-brun">Emballage cadeau</p>
                  <p className="font-body text-xs text-gris-chaud mt-0.5">
                    Papier de soie, bolduc et carte message — <span className="text-emerald-600 font-semibold">Offert</span>
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors ${
                  giftWrapping ? "bg-ocre border-ocre" : "border-sable"
                }`}>
                  {giftWrapping && <CheckCircle size={14} className="text-white" />}
                </div>
              </button>
            </div>

            {/* Coordonnées */}
            <div className="bg-blanc-casse rounded-card shadow-card p-6">
              <h2 className="text-xl mb-4">Vos coordonnées</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm font-semibold text-brun block mb-1.5">Prénom <span className="text-terracotta">*</span></label>
                    <Input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Marie" className={errors.prenom ? "border-terracotta" : ""} />
                    {errors.prenom && <p className="font-body text-xs text-terracotta mt-1">{errors.prenom}</p>}
                  </div>
                  <div>
                    <label className="font-body text-sm font-semibold text-brun block mb-1.5">Nom <span className="text-terracotta">*</span></label>
                    <Input name="nom" value={form.nom} onChange={handleChange} placeholder="Dupont" className={errors.nom ? "border-terracotta" : ""} />
                    {errors.nom && <p className="font-body text-xs text-terracotta mt-1">{errors.nom}</p>}
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm font-semibold text-brun block mb-1.5">Email <span className="text-terracotta">*</span></label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="marie@exemple.fr" className={errors.email ? "border-terracotta" : ""} />
                  {errors.email && <p className="font-body text-xs text-terracotta mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="font-body text-sm font-semibold text-brun block mb-1.5">Téléphone <span className="text-terracotta">*</span></label>
                  <Input name="telephone" type="tel" value={form.telephone} onChange={handleChange} placeholder="06 12 34 56 78" className={errors.telephone ? "border-terracotta" : ""} />
                  {errors.telephone && <p className="font-body text-xs text-terracotta mt-1">{errors.telephone}</p>}
                </div>

                {livraison === "domicile" && (
                  <>
                    <div>
                      <label className="font-body text-sm font-semibold text-brun block mb-1.5">Adresse <span className="text-terracotta">*</span></label>
                      <Input name="adresse" value={form.adresse} onChange={handleChange} placeholder="12 rue des Fleurs" className={errors.adresse ? "border-terracotta" : ""} />
                      {errors.adresse && <p className="font-body text-xs text-terracotta mt-1">{errors.adresse}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-sm font-semibold text-brun block mb-1.5">Code postal <span className="text-terracotta">*</span></label>
                        <Input name="codePostal" value={form.codePostal} onChange={handleChange} placeholder="63200" className={errors.codePostal ? "border-terracotta" : ""} />
                        {errors.codePostal && <p className="font-body text-xs text-terracotta mt-1">{errors.codePostal}</p>}
                      </div>
                      <div>
                        <label className="font-body text-sm font-semibold text-brun block mb-1.5">Ville <span className="text-terracotta">*</span></label>
                        <Input name="ville" value={form.ville} onChange={handleChange} placeholder="Riom" className={errors.ville ? "border-terracotta" : ""} />
                        {errors.ville && <p className="font-body text-xs text-terracotta mt-1">{errors.ville}</p>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Paiement sécurisé Stripe */}
            <div className="bg-blanc-casse rounded-card shadow-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl">Paiement sécurisé</h2>
                <Lock size={16} className="text-vert-sauge" />
              </div>
              <div className="flex items-center gap-3 p-4 bg-sable/30 rounded-card">
                <CreditCard size={22} className="text-gris-chaud shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-brun">Paiement par carte bancaire</p>
                  <p className="font-body text-xs text-gris-chaud">Vous serez redirigé vers Stripe, plateforme de paiement sécurisée.</p>
                </div>
              </div>
              {payError && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-card px-4 py-3">
                  <p className="font-body text-sm text-red-700">{payError}</p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirection vers Stripe…
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Payer {total.toFixed(2)} € en sécurité
                </>
              )}
            </Button>
          </form>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-blanc-casse rounded-card shadow-card p-6 sticky top-28 space-y-5">
              <h2 className="text-xl">Ma commande</h2>

              {/* Articles */}
              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-start gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-brun leading-snug line-clamp-2">{product.name}</p>
                      <p className="font-body text-xs text-gris-chaud">× {quantity}</p>
                    </div>
                    <span className="font-body text-sm font-bold text-brun shrink-0">{(product.price * quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              {/* Code promo */}
              <div className="border-t border-sable pt-4">
                <p className="font-body text-sm font-semibold text-brun mb-2 flex items-center gap-1.5">
                  <Tag size={14} className="text-ocre" /> Code promo
                </p>
                {promoApplied ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-card px-3 py-2">
                    <span className="font-body text-sm text-emerald-700 font-semibold">{promoSuccess}</span>
                    <button type="button" onClick={handleRemovePromo} aria-label="Retirer le code promo" className="text-gris-chaud hover:text-terracotta transition-colors ml-2">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyPromo())}
                      placeholder="Ex : CARIBOU10"
                      className={`uppercase text-sm ${promoError ? "border-terracotta" : ""}`}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleApplyPromo} className="shrink-0 px-3 font-semibold">
                      OK
                    </Button>
                  </div>
                )}
                {promoError && <p className="font-body text-xs text-terracotta mt-1">{promoError}</p>}
              </div>

              {/* Totaux */}
              <div className="border-t border-sable pt-4 space-y-2 font-body text-sm">
                <div className="flex justify-between text-gris-chaud">
                  <span>Sous-total</span>
                  <span>{cartTotal.toFixed(2)} €</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Remise</span>
                    <span>- {discount.toFixed(2)} €</span>
                  </div>
                )}
                {giftWrapping && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Emballage cadeau</span>
                    <span className="font-semibold">Offert</span>
                  </div>
                )}
                <div className="flex justify-between text-gris-chaud">
                  <span>Livraison</span>
                  <span className={fraisLivraison === 0 ? "text-emerald-600 font-semibold" : "text-brun"}>
                    {fraisLivraison === 0 ? "Gratuite" : `${fraisLivraison.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-sable pt-2">
                  <span className="font-bold text-brun text-base">Total</span>
                  <span className="font-bold text-brun text-xl">{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
