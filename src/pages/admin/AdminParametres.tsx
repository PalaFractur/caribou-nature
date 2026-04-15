import { useState } from "react";
import { Eye, EyeOff, Store, Shield, Database } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth";
import { seedMockOrders } from "@/lib/orders";
import { supabase } from "@/lib/supabase";

export default function AdminParametres() {
  const { updatePassword } = useAuth();

  // Password change
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!newPwd || !confirmPwd) { setPwdError("Tous les champs sont requis."); return; }
    if (newPwd.length < 8) { setPwdError("Le nouveau mot de passe doit contenir au moins 8 caractères."); return; }
    if (newPwd !== confirmPwd) { setPwdError("Les mots de passe ne correspondent pas."); return; }

    setPwdLoading(true);
    const result = await updatePassword(newPwd);
    setPwdLoading(false);

    if (!result.success) {
      setPwdError(result.error || "Erreur lors de la mise à jour.");
    } else {
      setNewPwd("");
      setConfirmPwd("");
      setPwdSuccess("Mot de passe mis à jour avec succès.");
    }
  }

  async function handleResetOrders() {
    if (!window.confirm("Réinitialiser les commandes de test ?")) return;
    // Delete all orders and reseed
    await supabase.from("orders").delete().neq("id", ""); // delete all
    await seedMockOrders();
    alert("Les commandes de test ont été réinitialisées.");
  }

  async function handleClearNewsletter() {
    if (!window.confirm("Effacer tous les abonnés newsletter ? Cette action est irréversible.")) return;
    await supabase.from("newsletter_subscribers").delete().neq("id", "");
    alert("Les abonnés newsletter ont été effacés.");
  }

  const PasswordInput = ({
    label, value, onChange, show, onToggle, placeholder, id,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    show: boolean; onToggle: () => void; placeholder: string; id: string;
  }) => (
    <div>
      <label htmlFor={id} className="font-body text-sm font-semibold text-brun block mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 rounded-btn px-4 pr-10 font-body text-sm border border-sable bg-white text-brun focus:outline-none focus:ring-2 focus:ring-ocre focus:border-transparent transition-colors"
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gris-chaud hover:text-brun transition-colors">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Paramètres">
      <div className="max-w-2xl space-y-6">

        {/* Informations boutique */}
        <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-sable/30">
            <Store size={18} className="text-ocre" />
            <h2 className="font-display text-lg text-brun">Informations de la boutique</h2>
          </div>
          <div className="p-6 space-y-3">
            {[
              { label: "Nom de la boutique", value: "Caribou Nature" },
              { label: "Adresse", value: "12 rue Saint-Amable, 63200 Riom, Puy-de-Dôme" },
              { label: "Téléphone", value: "04 73 64 80 55" },
              { label: "Email", value: "caribounature@gmail.com" },
              { label: "Horaires", value: "Mar–Sam 10h–12h30 et 14h–19h" },
            ].map((row) => (
              <div key={row.label} className="flex flex-wrap gap-2">
                <span className="font-body text-sm text-gris-chaud w-40 shrink-0">{row.label} :</span>
                <span className="font-body text-sm text-brun font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sécurité — changement mot de passe Supabase */}
        <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-sable/30">
            <Shield size={18} className="text-ocre" />
            <h2 className="font-display text-lg text-brun">Sécurité</h2>
          </div>
          <div className="p-6">
            <p className="font-body text-sm text-gris-chaud mb-5">
              Modifiez le mot de passe de votre compte administrateur Supabase.
            </p>
            <form onSubmit={handleChangePassword} noValidate className="space-y-4">
              <PasswordInput
                id="newPwd" label="Nouveau mot de passe"
                value={newPwd} onChange={(v) => { setNewPwd(v); setPwdError(""); setPwdSuccess(""); }}
                show={showNew} onToggle={() => setShowNew((v) => !v)} placeholder="Minimum 8 caractères"
              />
              <PasswordInput
                id="confirmPwd" label="Confirmer le nouveau mot de passe"
                value={confirmPwd} onChange={(v) => { setConfirmPwd(v); setPwdError(""); setPwdSuccess(""); }}
                show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} placeholder="Répéter le nouveau mot de passe"
              />

              {pwdError && (
                <div className="bg-terracotta/10 border border-terracotta/30 rounded-btn px-4 py-2.5">
                  <p className="font-body text-sm text-terracotta">{pwdError}</p>
                </div>
              )}
              {pwdSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-btn px-4 py-2.5">
                  <p className="font-body text-sm text-green-700">{pwdSuccess}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={pwdLoading}
                className="flex items-center gap-2 h-10 px-5 bg-ocre hover:bg-terracotta disabled:opacity-60 text-white font-body font-semibold text-sm rounded-btn transition-colors"
              >
                {pwdLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Enregistrement…
                  </>
                ) : "Changer le mot de passe"}
              </button>
            </form>
          </div>
        </div>

        {/* Données */}
        <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-sable/30">
            <Database size={18} className="text-ocre" />
            <h2 className="font-display text-lg text-brun">Données</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-brun">Réinitialiser les commandes de test</p>
                <p className="font-body text-xs text-gris-chaud mt-0.5">
                  Efface toutes les commandes et régénère 5 commandes de démonstration dans Supabase.
                </p>
              </div>
              <button onClick={handleResetOrders} className="shrink-0 h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white font-body text-sm font-semibold rounded-btn transition-colors">
                Réinitialiser
              </button>
            </div>

            <div className="border-t border-sable/30 pt-4 flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-brun">Effacer les abonnés newsletter</p>
                <p className="font-body text-xs text-gris-chaud mt-0.5">
                  Supprime définitivement tous les emails inscrits à la newsletter dans Supabase.
                </p>
              </div>
              <button onClick={handleClearNewsletter} className="shrink-0 h-9 px-4 bg-red-500 hover:bg-red-600 text-white font-body text-sm font-semibold rounded-btn transition-colors">
                Effacer
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
