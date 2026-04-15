import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { getBannerMessage, saveBanner } from "@/components/TopBar";
import { Check, Eye } from "lucide-react";

const BANNER_KEY = "cn_banner";

function getBannerState(): { message: string; enabled: boolean } {
  try {
    const raw = localStorage.getItem(BANNER_KEY);
    if (!raw) return { message: "🚚 Livraison gratuite dès 20€ sur Riom · 🎁 Emballage cadeau offert · ⭐ 4,7/5 sur Google", enabled: true };
    return JSON.parse(raw);
  } catch {
    return { message: "", enabled: true };
  }
}

export default function AdminBanniere() {
  const [message, setMessage] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const state = getBannerState();
    setMessage(state.message);
    setEnabled(state.enabled);
  }, []);

  const handleSave = () => {
    saveBanner(message, enabled);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const presets = [
    "🚚 Livraison gratuite dès 20€ sur Riom · 🎁 Emballage cadeau offert · ⭐ 4,7/5 sur Google",
    "🎄 Livraison gratuite jusqu'au 20 décembre · 🎁 Emballage cadeau offert · Commandez vite !",
    "🐣 Spécial Pâques — -10% avec le code PAQUES · Livraison gratuite dès 20€",
    "⭐ Nouveautés printemps disponibles ! · 🚚 Livraison gratuite dès 20€",
    "🏪 Click & Collect disponible en 2h · 12 rue Saint-Amable, Riom · Tél. 04 73 64 80 55",
  ];

  return (
    <AdminLayout title="Bannière du site">
      <div className="max-w-2xl space-y-6">

        {/* Aperçu */}
        <div className="bg-blanc-casse rounded-card shadow-card p-6">
          <h2 className="font-display text-lg text-brun mb-4">Aperçu</h2>
          <div className={`rounded-card px-4 py-3 text-center text-sm font-body transition-opacity ${enabled ? "bg-brun text-creme" : "bg-sable/50 text-gris-chaud opacity-60"}`}>
            {message || "Aperçu de votre message…"}
          </div>
          {!enabled && (
            <p className="font-body text-xs text-gris-chaud mt-2 text-center">La bannière est désactivée — le message par défaut s'affichera.</p>
          )}
        </div>

        {/* Activation */}
        <div className="bg-blanc-casse rounded-card shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-brun">Message personnalisé</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="font-body text-sm text-gris-chaud">Activer</span>
              <div
                onClick={() => setEnabled(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${enabled ? "bg-ocre" : "bg-sable"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
              </div>
            </label>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Ex : 🎄 Spécial Noël — Livraison gratuite · Emballage cadeau offert"
            className="w-full rounded-md border border-sable px-3 py-2 font-body text-sm bg-background text-brun resize-none focus:outline-none focus:ring-2 focus:ring-ocre/40"
          />
          <p className="font-body text-xs text-gris-chaud mt-1">{message.length} / 120 caractères</p>
        </div>

        {/* Messages prédéfinis */}
        <div className="bg-blanc-casse rounded-card shadow-card p-6">
          <h2 className="font-display text-lg text-brun mb-4">Messages prédéfinis</h2>
          <div className="space-y-2">
            {presets.map((preset, i) => (
              <button
                key={i}
                onClick={() => { setMessage(preset); setEnabled(true); }}
                className="w-full text-left px-4 py-3 rounded-card border border-sable hover:border-ocre hover:bg-ocre/5 font-body text-sm text-brun transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="gap-2 w-full">
          {saved ? <><Check size={16} /> Sauvegardé !</> : <><Eye size={16} /> Enregistrer et appliquer</>}
        </Button>

        <p className="font-body text-xs text-gris-chaud text-center">
          La bannière est stockée localement. Elle sera identique sur tous les navigateurs une fois Supabase connecté.
        </p>
      </div>
    </AdminLayout>
  );
}
