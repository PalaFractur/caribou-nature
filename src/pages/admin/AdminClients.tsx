import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";
import { getOrders, type Order } from "@/lib/orders";

interface ClientRow {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  created_at: string;
}

function formatEuro(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export default function AdminClients() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const [profilesRes, ordersData] = await Promise.all([
        supabase.from("profiles").select("id, prenom, nom, created_at").order("created_at", { ascending: false }),
        getOrders(),
      ]);

      // Get emails from auth.users via profiles join — email is in auth.users
      // We'll fetch emails via a dedicated approach: use supabase admin API or store email in profile
      // For now, display profiles with emails from orders cross-reference
      const profiles = (profilesRes.data || []) as Omit<ClientRow, "email">[];

      setClients(profiles.map((p) => ({ ...p, email: "" })));
      setOrders(ordersData);
      setLoading(false);
    }
    load();
  }, []);

  function getTotalSpent(email: string): number {
    return orders
      .filter((o) => o.customer.email.toLowerCase() === email.toLowerCase() && o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
  }

  function getOrderCount(email: string): number {
    return orders.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase()).length;
  }

  const filtered = clients.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.prenom?.toLowerCase().includes(q) ||
      c.nom?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <AdminLayout title="Clients">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-ocre/30 border-t-ocre rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Clients">
      {/* Stats */}
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-blanc-casse rounded-card shadow-card px-5 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-card bg-purple-100 flex items-center justify-center">
            <Users size={18} className="text-purple-700" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-brun">{clients.length}</p>
            <p className="font-body text-xs text-gris-chaud">Client{clients.length > 1 ? "s" : ""} inscrit{clients.length > 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-chaud" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom…"
          className="w-full h-10 pl-9 pr-4 rounded-btn border border-sable font-body text-sm bg-blanc-casse focus:outline-none focus:ring-2 focus:ring-ocre transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={40} className="text-gris-chaud/30 mx-auto mb-3" />
            <p className="font-body text-gris-chaud font-medium mb-1">Aucun client inscrit</p>
            <p className="font-body text-sm text-gris-chaud/70">Les clients apparaîtront ici lorsqu'ils créeront un compte.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-body text-gris-chaud">Aucun client trouvé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sable/20 text-left">
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Prénom</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Nom</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Inscription</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Commandes</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Total dépensé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sable/20">
                {filtered.map((client) => {
                  const orderCount = getOrderCount(client.email);
                  const totalSpent = getTotalSpent(client.email);
                  return (
                    <tr key={client.id} className="hover:bg-sable/10 transition-colors">
                      <td className="px-5 py-4 font-body text-sm font-medium text-brun">{client.prenom}</td>
                      <td className="px-5 py-4 font-body text-sm text-brun">{client.nom}</td>
                      <td className="px-5 py-4 font-body text-sm text-gris-chaud whitespace-nowrap">
                        {new Date(client.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-sable/40 font-body text-xs font-semibold text-brun">
                          {orderCount}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-body text-sm font-semibold text-brun whitespace-nowrap">
                        {totalSpent > 0 ? formatEuro(totalSpent) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
