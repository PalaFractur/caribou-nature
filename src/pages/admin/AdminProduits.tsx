import { useEffect, useState, useRef } from "react";
import { Search, Check, Package } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { products as staticProducts, type Product } from "@/data/products";
import { supabase } from "@/lib/supabase";

function stockBadgeClass(stock: number): string {
  if (stock === 0) return "bg-red-100 text-red-700 font-bold";
  if (stock <= 2) return "bg-orange-100 text-orange-700 font-bold";
  if (stock <= 5) return "bg-yellow-100 text-yellow-700 font-semibold";
  return "bg-green-100 text-green-700";
}

function stockBadgeLabel(stock: number): string {
  if (stock === 0) return "Rupture";
  return String(stock);
}

const ALL_CATEGORIES = Array.from(new Set(staticProducts.map((p) => p.category))).sort();

export default function AdminProduits() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [editingStockValue, setEditingStockValue] = useState<string>("");
  const stockInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("stock_overrides").select("*");
      const overrides: Record<number, { stock: number; is_new: boolean }> = {};
      (data || []).forEach((row: { product_id: number; stock: number; is_new: boolean }) => {
        overrides[row.product_id] = { stock: row.stock, is_new: row.is_new };
      });
      setProducts(staticProducts.map((p) => ({
        ...p,
        stock: overrides[p.id]?.stock ?? p.stock,
        isNew: overrides[p.id]?.is_new ?? p.isNew,
      })));
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (editingStockId !== null && stockInputRef.current) {
      stockInputRef.current.focus();
      stockInputRef.current.select();
    }
  }, [editingStockId]);

  function startEditStock(product: Product) {
    setEditingStockId(product.id);
    setEditingStockValue(String(product.stock));
  }

  async function commitStockEdit(id: number) {
    const parsed = parseInt(editingStockValue, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      await supabase.from("stock_overrides").upsert({
        product_id: id,
        stock: parsed,
        is_new: products.find((p) => p.id === id)?.isNew ?? false,
        updated_at: new Date().toISOString(),
      }, { onConflict: "product_id" });
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: parsed } : p)));
    }
    setEditingStockId(null);
  }

  async function toggleNew(product: Product) {
    const newVal = !product.isNew;
    await supabase.from("stock_overrides").upsert({
      product_id: product.id,
      stock: product.stock,
      is_new: newVal,
      updated_at: new Date().toISOString(),
    }, { onConflict: "product_id" });
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, isNew: newVal } : p)));
  }

  const filtered = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const total = products.length;
  const enRupture = products.filter((p) => p.stock === 0).length;
  const stockFaible = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const bonneDispo = products.filter((p) => p.stock > 5).length;

  if (loading) {
    return (
      <AdminLayout title="Produits">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-ocre/30 border-t-ocre rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Produits">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total produits", value: total, cls: "text-brun" },
          { label: "En rupture", value: enRupture, cls: "text-red-600" },
          { label: "Stock faible", value: stockFaible, cls: "text-yellow-600" },
          { label: "Bonne dispo.", value: bonneDispo, cls: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-blanc-casse rounded-card shadow-card p-4 text-center">
            <p className={`font-display text-2xl font-bold ${s.cls}`}>{s.value}</p>
            <p className="font-body text-xs text-gris-chaud mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-chaud" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="w-full h-10 pl-9 pr-4 rounded-btn border border-sable font-body text-sm bg-blanc-casse focus:outline-none focus:ring-2 focus:ring-ocre transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-btn border border-sable font-body text-sm bg-blanc-casse text-brun focus:outline-none focus:ring-2 focus:ring-ocre cursor-pointer"
        >
          <option value="all">Toutes les catégories</option>
          {ALL_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-gris-chaud/30 mx-auto mb-3" />
            <p className="font-body text-gris-chaud">Aucun produit trouvé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sable/20 text-left">
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Image</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Nom</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Catégorie</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Prix</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Stock</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Nouveau</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sable/20">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-sable/10 transition-colors">
                    <td className="px-5 py-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-body text-sm font-semibold text-brun max-w-xs leading-snug">{product.name}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-body text-xs text-gris-chaud bg-sable/40 px-2 py-0.5 rounded-full whitespace-nowrap">{product.category}</span>
                    </td>
                    <td className="px-5 py-3 font-body text-sm font-semibold text-brun whitespace-nowrap">{product.price.toFixed(2)} €</td>
                    <td className="px-5 py-3">
                      {editingStockId === product.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            ref={stockInputRef}
                            type="number"
                            min={0}
                            value={editingStockValue}
                            onChange={(e) => setEditingStockValue(e.target.value)}
                            onBlur={() => commitStockEdit(product.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitStockEdit(product.id);
                              if (e.key === "Escape") setEditingStockId(null);
                            }}
                            className="w-16 h-7 px-2 rounded-btn border border-ocre font-body text-sm text-brun text-center focus:outline-none focus:ring-2 focus:ring-ocre"
                          />
                          <button
                            onMouseDown={(e) => { e.preventDefault(); commitStockEdit(product.id); }}
                            className="w-7 h-7 rounded-btn bg-ocre hover:bg-terracotta text-white flex items-center justify-center transition-colors"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEditStock(product)} title="Cliquer pour modifier" className="cursor-pointer hover:opacity-80 transition-opacity">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-xs ${stockBadgeClass(product.stock)}`}>
                            {stockBadgeLabel(product.stock)}
                          </span>
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-xs font-medium ${product.isNew ? "bg-ocre/15 text-ocre" : "bg-sable/30 text-gris-chaud"}`}>
                        {product.isNew ? "Oui" : "Non"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleNew(product)}
                        className={`font-body text-xs px-3 py-1.5 rounded-btn border transition-colors whitespace-nowrap ${
                          product.isNew
                            ? "border-gris-chaud/30 text-gris-chaud hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                            : "border-ocre/40 text-ocre hover:bg-ocre hover:text-white"
                        }`}
                      >
                        {product.isNew ? "Retirer des nouveautés" : "Marquer comme nouveau"}
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
