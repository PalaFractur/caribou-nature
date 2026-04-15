import ReactDOM from "react-dom";
import { Order } from "@/lib/orders";

interface PrintOrderProps {
  order: Order;
}

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

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  ready: "Prête",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

function PrintOrderContent({ order }: PrintOrderProps) {
  return (
    <div id="print-order" style={{ fontFamily: "Arial, sans-serif", padding: "40px", color: "#333", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", borderBottom: "2px solid #333", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 4px 0" }}>Caribou Nature</h1>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>12 rue Saint-Amable, 63200 Riom</p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>Tél. : 04 73 64 80 55</p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>contact@caribounature-riom.fr</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 6px 0" }}>BON DE COMMANDE</h2>
          <p style={{ margin: "2px 0", fontSize: "13px" }}><strong>Référence :</strong> {order.id}</p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}><strong>Date :</strong> {formatDate(order.date)}</p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}><strong>Statut :</strong> {STATUS_LABELS[order.status] || order.status}</p>
        </div>
      </div>

      {/* Customer info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px", color: "#555" }}>Client</h3>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>{order.customer.prenom} {order.customer.nom}</p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>{order.customer.email}</p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>{order.customer.telephone}</p>
        </div>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px", color: "#555" }}>Livraison</h3>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>
            {order.livraison === "domicile" ? "Livraison à domicile" : "Click & Collect"}
          </p>
          {order.address && (
            <p style={{ margin: "2px 0", fontSize: "13px" }}>{order.address}</p>
          )}
          {order.livraison === "click-collect" && (
            <p style={{ margin: "2px 0", fontSize: "13px" }}>12 rue Saint-Amable, 63200 Riom</p>
          )}
          {order.giftWrapping && (
            <p style={{ margin: "4px 0", fontSize: "13px", fontStyle: "italic" }}>Emballage cadeau inclus</p>
          )}
        </div>
      </div>

      {/* Items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", fontSize: "13px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #ccc", fontWeight: "bold" }}>Article</th>
            <th style={{ textAlign: "center", padding: "10px 12px", borderBottom: "1px solid #ccc", fontWeight: "bold", width: "80px" }}>Qté</th>
            <th style={{ textAlign: "right", padding: "10px 12px", borderBottom: "1px solid #ccc", fontWeight: "bold", width: "100px" }}>Prix unit.</th>
            <th style={{ textAlign: "right", padding: "10px 12px", borderBottom: "1px solid #ccc", fontWeight: "bold", width: "100px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.productId} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px 12px" }}>{item.name}</td>
              <td style={{ padding: "10px 12px", textAlign: "center" }}>{item.quantity}</td>
              <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatEuro(item.price)}</td>
              <td style={{ padding: "10px 12px", textAlign: "right" }}>{formatEuro(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
        <div style={{ width: "260px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px", borderBottom: "1px solid #eee" }}>
            <span>Sous-total</span>
            <span>{formatEuro(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px", borderBottom: "1px solid #eee" }}>
              <span>Remise {order.promoCode ? `(${order.promoCode})` : ""}</span>
              <span>- {formatEuro(order.discount)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px", borderBottom: "1px solid #eee" }}>
            <span>Frais de livraison</span>
            <span>{order.shipping === 0 ? "Gratuit" : formatEuro(order.shipping)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "15px", fontWeight: "bold", borderTop: "2px solid #333" }}>
            <span>TOTAL</span>
            <span>{formatEuro(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #ccc", paddingTop: "16px", textAlign: "center", fontSize: "12px", color: "#777" }}>
        <p>Merci pour votre commande ! — Caribou Nature · 12 rue Saint-Amable, 63200 Riom · 04 73 64 80 55</p>
        <p style={{ marginTop: "4px" }}>En cas de question, contactez-nous à contact@caribounature-riom.fr</p>
      </div>
    </div>
  );
}

export default function PrintOrder({ order }: PrintOrderProps) {
  const container = document.body;
  return ReactDOM.createPortal(<PrintOrderContent order={order} />, container);
}
