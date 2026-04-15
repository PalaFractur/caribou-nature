import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "caribounature@gmail.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "commandes@caribounature.fr";

    const subjectLabels: Record<string, string> = {
      commande: "Passer une commande",
      conseil: "Demande de conseil",
      "click-collect": "Click & Collect",
      cadeau: "Idée cadeau",
      autre: "Autre",
    };

    await resend.emails.send({
      from: `Caribou Nature <${fromEmail}>`,
      to: adminEmail,
      replyTo: email,
      subject: `[Contact] ${subjectLabels[subject] || subject} — ${name}`,
      html: `
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ""}
        <p><strong>Sujet :</strong> ${subjectLabels[subject] || subject}</p>
        <hr/>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return res.status(500).json({ error: "Erreur lors de l'envoi" });
  }
}
