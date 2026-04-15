import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Search, Download, Printer } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { getOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/orders";
import PrintOrder from "@/components/PrintOrder";
import { Button } from "@/components/ui/button";

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

const ALL_STATUSES: OrderStatus[] = ["pending", "confirmed", "ready", "shipped", "delivered", "cancelled"];
type FilterTab = "all" | OrderStatus;

function formatEuro(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function escapeCsvCell(val: string | number | boolean | null | undefined): string {
  const str = val === null || val === undefined ? "" : String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportOrdersCSV(orders: Order[]): void {
  const BOM = "\uFEFF";
  const headers = [
    "N°", "Date", "Prénom", "Nom", "Email", "Téléphone",
    "Livraison", "Adresse", "Produits", "Sous-total", "Remise",
    "Livraison (frais)", "Total", "Statut", "Emballage cadeau", "Code promo",
  ];
  const rows = orders.map((o) => [
    o.id,
    new Date(o.date).toLocaleDateString("fr-FR"),
    o.customer.prenom, o.customer.nom, o.customer.email, o.customer.telephone,
    o.livraison === "domicile" ? "Domicile" : "Click & Collect",
    o.address || "",
    o.items.map((i) => `${i.name} ×${i.quantity}`).join(" | "),
    o.subtotal.toFixed(2), o.discount.toFixed(2), o.shipping.toFixed(2), o.total.toFixed(2),
    STATUS_LABELS[o.status],
    o.giftWrapping ? "Oui" : "Non",
    o.promoCode || "",
  ]);
  const csvContent = BOM + [headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  const today = new Date().toISOString().slice(0, 10);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `commandes-caribou-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminCommandes() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"date" | "total">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  async function handleStatusChange(id: string, status: OrderStatus) {
    await updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function handleSort(key: "date" | "total") {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  function handlePrint(order: Order) {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintOrder(null), 500);
    }, 100);
  }

  const filtered = orders
    .filter((o) => {
      if (activeTab !== "all" && o.status !== activeTab) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const fullName = `${o.customer.prenom} ${o.customer.nom}`.toLowerCase();
        if (!fullName.includes(q) && !o.id.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      else cmp = a.total - b.total;
      return sortDir === "asc" ? cmp : -cmp;
    });

  function countByStatus(status: FilterTab): number {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.status === status).length;
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "pending", label: "En attente" },
    { key: "confirmed", label: "Confirmées" },
    { key: "ready", label: "Prêtes" },
    { key: "shipped", label: "Expédiées" },
    { key: "delivered", label: "Livrées" },
    { key: "cancelled", label: "Annulées" },
  ];

  function SortIcon({ col }: { col: "date" | "total" }) {
    if (sortKey !== col) return <ChevronDown size={14} className="text-gris-chaud/40" />;
    return sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  }

  if (loading) {
    return (
      <AdminLayout title="Commandes">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-ocre/30 border-t-ocre rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Commandes">
      {printOrder && <PrintOrder order={printOrder} />}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-chaud" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par client ou N° commande…"
            className="w-full h-10 pl-9 pr-4 rounded-btn border border-sable font-body text-sm bg-blanc-casse focus:outline-none focus:ring-2 focus:ring-ocre focus:border-transparent transition-colors"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => exportOrdersCSV(filtered)} className="gap-1.5 shrink-0">
          <Download size={15} /> Exporter CSV
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((tab) => {
          const count = countByStatus(tab.key);
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn font-body text-sm font-medium transition-colors ${
                active ? "bg-brun text-creme" : "bg-blanc-casse text-gris-chaud border border-sable hover:border-brun/30 hover:text-brun"
              }`}
            >
              {tab.label}
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-bold ${
                active ? "bg-white/20 text-creme" : "bg-sable text-gris-chaud"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-body text-gris-chaud">Aucune commande trouvée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sable/20 text-left">
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">N°</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider cursor-pointer hover:text-brun select-none" onClick={() => handleSort("date")}>
                    <span className="flex items-center gap-1">Date <SortIcon col="date" /></span>
                  </th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Client</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Livraison</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Articles</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider cursor-pointer hover:text-brun select-none" onClick={() => handleSort("total")}>
                    <span className="flex items-center gap-1">Total <SortIcon col="total" /></span>
                  </th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Statut</th>
                  <th className="px-5 py-3 font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sable/20">
                {filtered.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="hover:bg-sable/10 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <td className="px-5 py-4 font-body text-sm font-semibold text-brun whitespace-nowrap">{order.id}</td>
                      <td className="px-5 py-4 font-body text-sm text-gris-chaud whitespace-nowrap">{new Date(order.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-body text-sm font-medium text-brun">{order.customer.prenom} {order.customer.nom}</p>
                        <p className="font-body text-xs text-gris-chaud">{order.customer.email}</p>
                      </td>
                      <td className="px-5 py-4 font-body text-sm text-gris-chaud whitespace-nowrap">
                        {order.livraison === "domicile" ? "Domicile" : "Click & Collect"}
                      </td>
                      <td className="px-5 py-4 font-body text-sm text-gris-chaud whitespace-nowrap">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} article{order.items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}
                      </td>
                      <td className="px-5 py-4 font-body text-sm font-semibold text-brun whitespace-nowrap">{formatEuro(order.total)}</td>
                      <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-xs font-medium ${STATUS_CLASSES[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="font-body text-sm border border-sable rounded-btn px-2 py-1 bg-blanc-casse text-brun focus:outline-none focus:ring-2 focus:ring-ocre cursor-pointer"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                          <button onClick={() => handlePrint(order)} aria-label="Imprimer" className="p-1.5 text-gris-chaud hover:text-brun transition-colors rounded" title="Imprimer">
                            <Printer size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr key={`${order.id}-expanded`} className="bg-sable/10">
                        <td colSpan={8} className="px-8 py-4">
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-6 text-sm font-body">
                              <div><span className="text-gris-chaud">Téléphone :</span>{" "}<span className="text-brun font-medium">{order.customer.telephone}</span></div>
                              {order.address && <div><span className="text-gris-chaud">Adresse :</span>{" "}<span className="text-brun font-medium">{order.address}</span></div>}
                              {order.promoCode && <div><span className="text-gris-chaud">Code promo :</span>{" "}<span className="text-brun font-medium">{order.promoCode}</span></div>}
                              {order.giftWrapping && <div><span className="text-emerald-600 font-semibold">🎁 Emballage cadeau</span></div>}
                            </div>
                            <div className="border-t border-sable/30 pt-3">
                              <p className="font-body text-xs font-semibold text-gris-chaud uppercase tracking-wider mb-2">Articles commandés</p>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item.productId} className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-body text-sm text-brun font-medium">{item.name}</p>
                                      <p className="font-body text-xs text-gris-chaud">{formatEuro(item.price)} × {item.quantity}</p>
                                    </div>
                                    <span className="font-body text-sm font-semibold text-brun shrink-0">{formatEuro(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="border-t border-sable/30 pt-2 flex flex-wrap gap-6 font-body text-sm">
                              <div className="text-gris-chaud">Sous-total : <span className="text-brun font-medium">{formatEuro(order.subtotal)}</span></div>
                              {order.discount > 0 && <div className="text-emerald-600">Remise : <span className="font-medium">- {formatEuro(order.discount)}</span></div>}
                              <div className="text-gris-chaud">Livraison : <span className="text-brun font-medium">{order.shipping === 0 ? "Gratuite" : formatEuro(order.shipping)}</span></div>
                              <div className="text-brun font-bold">Total : {formatEuro(order.total)}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
