import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

function formatEuro(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function buildConfirmationEmail(order: Record<string, unknown>): string {
  const customer = order.customer as { prenom: string; nom: string; email: string };
  const items = (order.items as Array<{ name: string; quantity: number; price: number }>) || [];
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0e6d3; font-size: 14px; color: #3d2b1a;">
          ${item.name} × ${item.quantity}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f0e6d3; font-size: 14px; color: #3d2b1a; text-align: right;">
          ${formatEuro(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f5ede0; font-family: Georgia, serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5ede0; padding: 40px 20px;">
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; background: #faf6f0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #3d2b1a; padding: 32px; text-align: center;">
              <p style="margin: 0; color: #f5ede0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">🍃 Caribou Nature</p>
              <p style="margin: 8px 0 0; color: #c9a87c; font-size: 13px;">12 rue Saint-Amable · 63200 Riom</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 8px; font-size: 22px; color: #3d2b1a;">Merci pour votre commande !</h1>
              <p style="margin: 0 0 24px; color: #7a6552; font-size: 14px;">
                Bonjour ${customer.prenom}, votre commande <strong style="color: #c9a87c;">${order.id}</strong> a bien été reçue et votre paiement confirmé.
              </p>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                ${itemsHtml}
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #f0e6d3; padding-top: 16px;">
                ${Number(order.discount) > 0 ? `
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #7a6552;">Remise${order.promo_code ? ` (${order.promo_code})` : ""}</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #22863a; text-align: right;">- ${formatEuro(Number(order.discount))}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #7a6552;">Livraison</td>
                  <td style="padding: 4px 0; font-size: 13px; color: ${Number(order.shipping) === 0 ? "#22863a" : "#3d2b1a"}; text-align: right;">
                    ${Number(order.shipping) === 0 ? "Gratuite" : formatEuro(Number(order.shipping))}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0 0; font-size: 16px; font-weight: bold; color: #3d2b1a;">Total</td>
                  <td style="padding: 8px 0 0; font-size: 16px; font-weight: bold; color: #c9a87c; text-align: right;">${formatEuro(Number(order.total))}</td>
                </tr>
              </table>

              <!-- Delivery -->
              <div style="margin-top: 24px; padding: 16px; background: #f0e6d3; border-radius: 8px;">
                <p style="margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #3d2b1a;">
                  ${order.livraison === "domicile" ? "🚚 Livraison à domicile" : "🏪 Click & Collect"}
                </p>
                <p style="margin: 0; font-size: 13px; color: #7a6552;">
                  ${order.address || "12 rue Saint-Amable, 63200 Riom — Prêt en 2h"}
                </p>
              </div>

              ${order.gift_wrapping ? `
              <div style="margin-top: 12px; padding: 12px 16px; background: #fff9f0; border: 1px solid #f0e6d3; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #3d2b1a;">🎁 Emballage cadeau inclus</p>
              </div>` : ""}

              <p style="margin: 24px 0 0; font-size: 13px; color: #7a6552; line-height: 1.6;">
                Notre équipe traite votre commande. Vous serez contacté(e) pour toute information complémentaire.
              </p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #7a6552;">
                📞 <a href="tel:0473648055" style="color: #c9a87c;">04 73 64 80 55</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #3d2b1a; padding: 20px 32px; text-align: center;">
              <p style="margin: 0; color: #c9a87c; font-size: 12px;">
                Caribou Nature · 12 rue Saint-Amable · 63200 Riom<br>
                Mar–Sam 10h–12h30 et 14h–19h
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { order } = req.body;
    if (!order) return res.status(400).json({ error: "No order provided" });

    const customer = order.customer as { prenom: string; nom: string; email: string };
    const fromEmail = process.env.RESEND_FROM_EMAIL || "commandes@caribounature.fr";
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "caribounature@gmail.com";

    // Send confirmation to customer
    await resend.emails.send({
      from: `Caribou Nature <${fromEmail}>`,
      to: customer.email,
      subject: `Confirmation de votre commande ${order.id} — Caribou Nature`,
      html: buildConfirmationEmail(order),
    });

    // Send notification to admin
    await resend.emails.send({
      from: `Caribou Nature <${fromEmail}>`,
      to: adminEmail,
      subject: `Nouvelle commande ${order.id} — ${customer.prenom} ${customer.nom}`,
      html: `<p>Nouvelle commande reçue :<br>
        <strong>${order.id}</strong><br>
        Client : ${customer.prenom} ${customer.nom} (${customer.email})<br>
        Total : ${order.total?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}<br>
        Livraison : ${order.livraison === "domicile" ? "Domicile" : "Click & Collect"}
      </p>`,
    });

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: "Email send failed" });
  }
}
