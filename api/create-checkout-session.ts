import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateOrderId(existingCount: number): string {
  const year = new Date().getFullYear();
  return `CN-${year}-${String(existingCount + 1).padStart(3, "0")}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      customer, livraison, address, items,
      subtotal, discount, shipping, total,
      giftWrapping, promoCode, userId,
      successUrl, cancelUrl,
    } = req.body;

    // Validate required fields
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Données invalides." });
    }

    // Generate order ID
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const orderId = generateOrderId(count || 0);

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: {
      name: string; price: number; quantity: number; image?: string;
    }) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Frais de livraison" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add discount as a negative line item if applicable
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: promoCode ? `Remise (${promoCode})` : "Remise" },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: customer.email,
      locale: "fr",
      metadata: {
        orderId,
        userId: userId || "",
      },
      payment_intent_data: {
        metadata: { orderId },
      },
    });

    // Save draft order to Supabase
    await supabase.from("orders").insert({
      id: orderId,
      user_id: userId || null,
      customer,
      livraison,
      address: address || null,
      items,
      subtotal,
      discount,
      shipping,
      total,
      gift_wrapping: giftWrapping,
      promo_code: promoCode || null,
      status: "pending",
      stripe_session_id: session.id,
      payment_status: "pending",
      date: new Date().toISOString(),
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Checkout session error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Erreur serveur.",
    });
  }
}
