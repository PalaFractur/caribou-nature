import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPromoCodes,
  addPromoCode,
  togglePromoCode,
  deletePromoCode,
  type PromoCodeConfig,
} from "@/lib/promoCodes";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export default function AdminPromoCodes() {
  const [codes, setCodes] = useState<PromoCodeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percent" | "fixed">("percent");
  const [newValue, setNewValue] = useState("");
  const [error, setError] = useState("");

  async function refresh() {
    const data = await getPromoCodes();
    setCodes(data);
  }

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  async function handleToggle(code: string) {
    await togglePromoCode(code);
    await refresh();
  }

  async function handleDelete(code: string) {
    if (!window.confirm(`Supprimer le code "${code}" ?`)) return;
    await deletePromoCode(code);
    await refresh();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const codeUpper = newCode.trim().toUpperCase();
    const valueNum = parseFloat(newValue);

    if (!codeUpper) { setError("Le code est requis."); return; }
    if (codes.some((c) => c.code === codeUpper)) { setError("Ce code existe déjà."); return; }
    if (isNaN(valueNum) || valueNum <= 0) { setError("La valeur doit être supérieure à 0."); return; }

    const label = newType === "percent"
      ? `-${valueNum} %`
      : `-${valueNum.toFixed(2).replace(".", ",")} €`;

    await addPromoCode({
      code: codeUpper,
      type: newType,
      value: valueNum,
      label,
      active: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    });
    await refresh();
    setNewCode("");
    setNewValue("");
    setNewType("percent");
  }

  if (loading) {
    return (
      <AdminLayout title="Codes promo">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-ocre/30 border-t-ocre rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Codes promo">
      {/* Add form */}
      <div className="bg-blanc-casse rounded-card shadow-card p-6 mb-6">
        <h2 className="font-display text-lg text-brun mb-4">Ajouter un code promo</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="font-body text-xs font-semibold text-gris-chaud block mb-1">Code</label>
            <Input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="Ex : ETE2026"
              className="w-36 uppercase"
            />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-gris-chaud block mb-1">Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as "percent" | "fixed")}
              className="h-10 px-3 rounded-btn border border-sable font-body text-sm bg-blanc-casse text-brun focus:outline-none focus:ring-2 focus:ring-ocre"
            >
              <option value="percent">Pourcentage (%)</option>
              <option value="fixed">Montant fixe (€)</option>
            </select>
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-gris-chaud block mb-1">Valeur</label>
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              type="number"
              min="0.01"
              step="0.01"
              placeholder={newType === "percent" ? "10" : "5.00"}
              className="w-28"
            />
          </div>
          <Button type="submit" className="gap-1.5 h-10">
            <Plus size={16} /> Ajouter
          </Button>
        </form>
        {error && <p className="font-body text-sm text-terracotta mt-2">{error}</p>}
      </div>

      {/* Table */}
      <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
        {codes.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-body text-gris-chaud">Aucun code promo configuré.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sable/20 text-left">
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Code</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Valeur</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Statut</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Utilisations</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Créé le</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sable/20">
                {codes.map((code) => (
                  <tr key={code.code} className="hover:bg-sable/10 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-body font-bold text-brun tracking-wider">{code.code}</span>
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-gris-chaud">
                      {code.type === "percent" ? "Pourcentage" : "Montant fixe"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-body font-semibold text-brun">{code.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(code.code)}
                        aria-label={code.active ? "Désactiver" : "Activer"}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          code.active ? "bg-vert-sauge" : "bg-gris-chaud/30"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          code.active ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                      <span className={`ml-2 font-body text-xs font-semibold ${code.active ? "text-vert-sauge" : "text-gris-chaud"}`}>
                        {code.active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-brun text-center">{code.usageCount}</td>
                    <td className="px-5 py-4 font-body text-sm text-gris-chaud whitespace-nowrap">{formatDate(code.createdAt)}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(code.code)}
                        aria-label={`Supprimer ${code.code}`}
                        className="text-gris-chaud hover:text-terracotta transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
