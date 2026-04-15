import { supabase } from "./supabase";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "ready"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  customer: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
  };
  livraison: "domicile" | "click-collect";
  address?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  giftWrapping: boolean;
  promoCode: string | null;
  status: OrderStatus;
  stripeSessionId?: string;
  paymentStatus?: string;
}

// ── Helpers to map Supabase snake_case ↔ camelCase ───────────────────────────
function fromDb(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    date: row.date as string,
    customer: row.customer as Order["customer"],
    livraison: row.livraison as Order["livraison"],
    address: row.address as string | undefined,
    items: row.items as OrderItem[],
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    giftWrapping: row.gift_wrapping as boolean,
    promoCode: row.promo_code as string | null,
    status: row.status as OrderStatus,
    stripeSessionId: row.stripe_session_id as string | undefined,
    paymentStatus: row.payment_status as string | undefined,
  };
}

// ── Read ──────────────────────────────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(fromDb);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(fromDb);
}

export async function getOrderBySessionId(sessionId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();
  if (error || !data) return null;
  return fromDb(data);
}

// ── Write (client-side, for non-Stripe flow if needed) ────────────────────────
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await supabase.from("orders").update({ status }).eq("id", id);
}

// ── Seed (development only) ───────────────────────────────────────────────────
export async function seedMockOrders(): Promise<void> {
  const { products } = await import("@/data/products");

  function daysAgo(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }

  const mock = [
    {
      id: "CN-2025-001", date: daysAgo(87),
      customer: { prenom: "Sophie", nom: "Marchand", email: "sophie.marchand@gmail.com", telephone: "06 12 34 56 78" },
      livraison: "domicile", address: "14 rue des Lilas, 63000 Clermont-Ferrand",
      items: [{ productId: products[0].id, name: products[0].name, price: products[0].price, quantity: 1, image: products[0].image }],
      subtotal: products[0].price, discount: 0, shipping: 0, total: products[0].price,
      gift_wrapping: false, promo_code: null, status: "delivered",
    },
    {
      id: "CN-2025-002", date: daysAgo(70),
      customer: { prenom: "Thomas", nom: "Dupont", email: "t.dupont@orange.fr", telephone: "07 23 45 67 89" },
      livraison: "click-collect", address: null,
      items: [{ productId: products[1].id, name: products[1].name, price: products[1].price, quantity: 2, image: products[1].image }],
      subtotal: products[1].price * 2, discount: 5, shipping: 0, total: products[1].price * 2 - 5,
      gift_wrapping: true, promo_code: "BIENVENUE", status: "delivered",
    },
    {
      id: "CN-2025-003", date: daysAgo(40),
      customer: { prenom: "Isabelle", nom: "Fontaine", email: "isabelle.fontaine@free.fr", telephone: "06 34 56 78 90" },
      livraison: "domicile", address: "3 allée des Platanes, 63200 Riom",
      items: [
        { productId: products[2].id, name: products[2].name, price: products[2].price, quantity: 1, image: products[2].image },
        { productId: products[3].id, name: products[3].name, price: products[3].price, quantity: 1, image: products[3].image },
      ],
      subtotal: products[2].price + products[3].price, discount: 0, shipping: 4.9, total: products[2].price + products[3].price + 4.9,
      gift_wrapping: false, promo_code: null, status: "shipped",
    },
    {
      id: "CN-2025-004", date: daysAgo(14),
      customer: { prenom: "Pierre", nom: "Moreau", email: "p.moreau@wanadoo.fr", telephone: "06 45 67 89 01" },
      livraison: "domicile", address: "27 rue Victor Hugo, 63300 Thiers",
      items: [{ productId: products[4].id, name: products[4].name, price: products[4].price, quantity: 1, image: products[4].image }],
      subtotal: products[4].price, discount: 0, shipping: 0, total: products[4].price,
      gift_wrapping: false, promo_code: null, status: "confirmed",
    },
    {
      id: "CN-2025-005", date: daysAgo(3),
      customer: { prenom: "Camille", nom: "Bernard", email: "camille.bernard@hotmail.com", telephone: "07 56 78 90 12" },
      livraison: "click-collect", address: null,
      items: [{ productId: products[5].id, name: products[5].name, price: products[5].price, quantity: 1, image: products[5].image }],
      subtotal: products[5].price, discount: 0, shipping: 0, total: products[5].price,
      gift_wrapping: true, promo_code: null, status: "pending",
    },
  ];

  for (const order of mock) {
    await supabase.from("orders").upsert(order, { onConflict: "id" });
  }
}
