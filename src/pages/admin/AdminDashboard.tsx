import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ShoppingBag, Users, AlertTriangle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { getOrders, seedMockOrders, type Order, type OrderStatus } from "@/lib/orders";
import { products as staticProducts, type Product } from "@/data/products";
import { supabase } from "@/lib/supabase";

function formatEuro(amount: number): string {
  return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

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

function stockBadgeClass(stock: number): string {
  if (stock === 0) return "bg-red-100 text-red-700";
  if (stock <= 2) return "bg-orange-100 text-orange-700";
  return "bg-yellow-100 text-yellow-700";
}

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function groupOrdersByDay(orders: Order[]): Record<string, number> {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    const day = o.date.slice(0, 10);
    map[day] = (map[day] || 0) + o.total;
  });
  return map;
}

function getCategorySales(orders: Order[]): { category: string; count: number }[] {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const prod = staticProducts.find((p) => p.id === item.productId);
      if (prod) map[prod.category] = (map[prod.category] || 0) + item.quantity;
    });
  });
  return Object.entries(map)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

async function getMergedProducts(): Promise<Product[]> {
  const { data } = await supabase.from("stock_overrides").select("*");
  const overrides: Record<number, { stock: number; is_new: boolean }> = {};
  (data || []).forEach((row: { product_id: number; stock: number; is_new: boolean }) => {
    overrides[row.product_id] = { stock: row.stock, is_new: row.is_new };
  });
  return staticProducts.map((p) => ({
    ...p,
    stock: overrides[p.id]?.stock ?? p.stock,
    isNew: overrides[p.id]?.is_new ?? p.isNew,
  }));
}

async function getClientCount(): Promise<number> {
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });
  return count || 0;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [alertesStock, setAlertesStock] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      let allOrders = await getOrders();
      if (allOrders.length === 0) {
        await seedMockOrders();
        allOrders = await getOrders();
      }
      setOrders(allOrders);

      const [count, merged] = await Promise.all([getClientCount(), getMergedProducts()]);
      setClientCount(count);
      setAlertesStock(merged.filter((p) => p.stock <= 5));
      setLoading(false);
    }
    load();
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalVentes = orders
    .filter((o) => o.status === "delivered" || o.status === "shipped")
    .reduce((sum, o) => sum + o.total, 0);

  const commandesDuMois = orders.filter((o) => {
    const d = new Date(o.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const kpis = [
    {
      label: "Total des ventes",
      value: formatEuro(totalVentes),
      icon: <TrendingUp size={22} />,
      iconBg: "bg-green-100 text-green-700",
      subtitle: "Commandes livrées + expédiées",
    },
    {
      label: "Commandes du mois",
      value: String(commandesDuMois),
      icon: <ShoppingBag size={22} />,
      iconBg: "bg-blue-100 text-blue-700",
      subtitle: `${new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`,
    },
    {
      label: "Clients inscrits",
      value: String(clientCount),
      icon: <Users size={22} />,
      iconBg: "bg-purple-100 text-purple-700",
      subtitle: "Comptes créés sur le site",
    },
    {
      label: "Alertes stock",
      value: String(alertesStock.length),
      icon: <AlertTriangle size={22} />,
      iconBg: alertesStock.length > 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500",
      subtitle: "Produits avec stock ≤ 5",
    },
  ];

  const last30Days = getLast30Days();
  const ordersByDay = groupOrdersByDay(orders);
  const barValues = last30Days.map((day) => ordersByDay[day] || 0);
  const maxBarValue = Math.max(...barValues, 1);

  const categorySales = getCategorySales(orders);
  const totalCategoryItems = categorySales.reduce((s, c) => s + c.count, 0) || 1;
  const BAR_COLORS = ["bg-ocre", "bg-vert-sauge", "bg-terracotta", "bg-brun", "bg-sable"];

  if (loading) {
    return (
      <AdminLayout title="Tableau de bord">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-ocre/30 border-t-ocre rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tableau de bord">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-blanc-casse rounded-card shadow-card p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-card flex items-center justify-center shrink-0 ${kpi.iconBg}`}>
              {kpi.icon}
            </div>
            <div className="min-w-0">
              <p className="font-body text-xs text-gris-chaud mb-0.5">{kpi.label}</p>
              <p className="font-display text-2xl text-brun font-bold leading-tight">{kpi.value}</p>
              <p className="font-body text-xs text-gris-chaud/70 mt-0.5">{kpi.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Bar chart */}
        <div className="bg-blanc-casse rounded-card shadow-card p-6">
          <h2 className="font-display text-lg text-brun mb-4">Ventes des 30 derniers jours</h2>
          <div className="flex items-end gap-0.5 h-32">
            {barValues.map((val, i) => {
              const heightPct = maxBarValue > 0 ? (val / maxBarValue) * 100 : 0;
              const dayLabel = last30Days[i];
              const displayDate = new Date(dayLabel + "T12:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
              return (
                <div
                  key={dayLabel}
                  className="flex-1 flex flex-col justify-end group relative"
                  title={val > 0 ? `${displayDate} : ${formatEuro(val)}` : displayDate}
                >
                  <div
                    className={`${val > 0 ? "bg-ocre" : "bg-sable/30"} rounded-t-sm transition-all duration-300 w-full min-h-[2px]`}
                    style={{ height: `${Math.max(heightPct, val > 0 ? 5 : 2)}%` }}
                  />
                  {val > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-brun text-creme text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {displayDate} : {formatEuro(val)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 font-body text-xs text-gris-chaud">
            <span>{new Date(last30Days[0] + "T12:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</span>
            <span>Aujourd'hui</span>
          </div>
        </div>

        {/* Category chart */}
        <div className="bg-blanc-casse rounded-card shadow-card p-6">
          <h2 className="font-display text-lg text-brun mb-4">Répartition par catégorie</h2>
          {categorySales.length === 0 ? (
            <p className="font-body text-sm text-gris-chaud">Aucune donnée disponible.</p>
          ) : (
            <div className="space-y-3">
              {categorySales.slice(0, 7).map((cat, i) => {
                const pct = Math.round((cat.count / totalCategoryItems) * 100);
                const barColor = BAR_COLORS[i % BAR_COLORS.length];
                return (
                  <div key={cat.category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-body text-xs text-brun truncate max-w-[70%]">{cat.category}</span>
                      <span className="font-body text-xs text-gris-chaud font-semibold ml-2 shrink-0">
                        {cat.count} art. · {pct} %
                      </span>
                    </div>
                    <div className="h-2.5 bg-sable rounded-full overflow-hidden">
                      <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2 bg-blanc-casse rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-sable/30">
            <h2 className="font-display text-lg text-brun">Dernières commandes</h2>
            <Link to="/admin/commandes" className="font-body text-sm text-ocre hover:text-terracotta transition-colors">
              Voir tout →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-body text-sm text-gris-chaud">Aucune commande pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sable/20 text-left">
                    <th className="px-6 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">N° commande</th>
                    <th className="px-6 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sable/20">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-sable/10 transition-colors">
                      <td className="px-6 py-4 font-body text-sm font-semibold text-brun whitespace-nowrap">{order.id}</td>
                      <td className="px-6 py-4 font-body text-sm text-brun whitespace-nowrap">
                        {order.customer.prenom} {order.customer.nom}
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-gris-chaud whitespace-nowrap">
                        {new Date(order.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 font-body text-sm font-semibold text-brun whitespace-nowrap">
                        {formatEuro(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-xs font-medium ${STATUS_CLASSES[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to="/admin/commandes" className="font-body text-sm text-ocre hover:text-terracotta transition-colors">
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stock alerts */}
        <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-sable/30">
            <h2 className="font-display text-lg text-brun">Alertes stock</h2>
            <Link to="/admin/produits" className="font-body text-sm text-ocre hover:text-terracotta transition-colors">
              Gérer →
            </Link>
          </div>
          {alertesStock.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-body text-sm text-gris-chaud">Aucune alerte stock.</p>
              <p className="font-body text-xs text-gris-chaud/60 mt-1">Tous les produits ont un stock suffisant.</p>
            </div>
          ) : (
            <div className="divide-y divide-sable/20">
              {alertesStock.map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-6 py-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-brun font-medium leading-snug line-clamp-2">{product.name}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-body text-xs font-bold shrink-0 ${stockBadgeClass(product.stock)}`}>
                    {product.stock === 0 ? "Rupture" : `${product.stock} en stock`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
