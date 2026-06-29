export interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  totalPrice: number;
  bookingId: string;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Casa Maddalena <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });
}

export async function sendOwnerNotification(booking: BookingEmailData) {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) return;

  await sendEmail(
    ownerEmail,
    `🌊 Nouvelle réservation — ${booking.guestName}`,
    `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0f9ff;padding:32px;border-radius:16px;">
      <div style="text-align:center;margin-bottom:28px;">
        <h1 style="color:#0284c7;font-size:28px;margin:0;">✅ Nouvelle réservation confirmée</h1>
        <p style="color:#64748b;margin:8px 0 0;">Casa Maddalena · Syracuse, Sicile</p>
      </div>

      <div style="background:white;border-radius:12px;padding:24px;margin-bottom:16px;border:1px solid #e0f2fe;">
        <h2 style="color:#0369a1;font-size:16px;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Voyageur</h2>
        <p style="margin:6px 0;color:#1e293b;"><strong>${booking.guestName}</strong></p>
        <p style="margin:6px 0;color:#64748b;"><a href="mailto:${booking.guestEmail}" style="color:#0284c7;">${booking.guestEmail}</a></p>
        ${booking.guestPhone ? `<p style="margin:6px 0;color:#64748b;">📱 ${booking.guestPhone}</p>` : ""}
      </div>

      <div style="background:white;border-radius:12px;padding:24px;margin-bottom:16px;border:1px solid #e0f2fe;">
        <h2 style="color:#0369a1;font-size:16px;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Séjour</h2>
        <p style="margin:6px 0;color:#1e293b;">📅 <strong>Arrivée :</strong> ${formatDate(booking.checkIn)}</p>
        <p style="margin:6px 0;color:#1e293b;">📅 <strong>Départ :</strong> ${formatDate(booking.checkOut)}</p>
        <p style="margin:6px 0;color:#64748b;">🌙 ${booking.nights} nuit(s) · 👥 ${booking.guests} voyageur(s)</p>
      </div>

      <div style="background:#0284c7;border-radius:12px;padding:24px;color:white;text-align:center;">
        <p style="margin:0;opacity:0.8;font-size:14px;">MONTANT TOTAL ENCAISSÉ</p>
        <p style="font-size:42px;font-weight:900;margin:8px 0;">${booking.totalPrice.toFixed(2)} €</p>
        <p style="opacity:0.7;margin:0;font-size:12px;">Paiement sécurisé via Stripe · ID: ${booking.bookingId}</p>
      </div>
    </div>
    `
  );
}

export async function sendGuestConfirmation(booking: BookingEmailData) {
  await sendEmail(
    booking.guestEmail,
    `✅ Réservation confirmée — Casa Maddalena`,
    `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0f9ff;padding:32px;border-radius:16px;">
      <div style="text-align:center;margin-bottom:28px;">
        <h1 style="color:#0284c7;font-size:26px;margin:0;">Bienvenue à Casa Maddalena ! 🌊</h1>
        <p style="color:#64748b;margin:8px 0 0;">Bonjour ${booking.guestName}, votre réservation est confirmée.</p>
      </div>

      <div style="background:white;border-radius:12px;padding:24px;margin-bottom:16px;border:1px solid #e0f2fe;">
        <h2 style="color:#0369a1;font-size:16px;margin:0 0 20px;text-transform:uppercase;letter-spacing:0.05em;">Votre séjour</h2>
        <table style="width:100%;border-collapse:separate;border-spacing:8px;">
          <tr>
            <td style="background:#f0f9ff;border-radius:8px;padding:16px;text-align:center;">
              <p style="color:#64748b;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:0.1em;">Arrivée</p>
              <p style="color:#0369a1;font-weight:700;margin:6px 0;">${formatDate(booking.checkIn)}</p>
              <p style="color:#64748b;font-size:12px;margin:0;">après 15h00</p>
            </td>
            <td style="background:#f0f9ff;border-radius:8px;padding:16px;text-align:center;">
              <p style="color:#64748b;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:0.1em;">Départ</p>
              <p style="color:#0369a1;font-weight:700;margin:6px 0;">${formatDate(booking.checkOut)}</p>
              <p style="color:#64748b;font-size:12px;margin:0;">avant 11h00</p>
            </td>
          </tr>
        </table>
        <p style="color:#64748b;margin:16px 0 0;text-align:center;">🌙 ${booking.nights} nuit(s) · 👥 ${booking.guests} voyageur(s)</p>
      </div>

      <div style="background:#0c4a6e;border-radius:12px;padding:24px;color:white;text-align:center;margin-bottom:16px;">
        <p style="margin:0;opacity:0.7;font-size:13px;">TOTAL PAYÉ</p>
        <p style="font-size:38px;font-weight:900;margin:8px 0;">${booking.totalPrice.toFixed(2)} €</p>
      </div>

      <div style="background:white;border-radius:12px;padding:24px;border:1px solid #e0f2fe;">
        <h2 style="color:#0369a1;font-size:15px;margin:0 0 12px;">📍 Syracuse, Sicile</h2>
        <p style="color:#64748b;font-size:14px;margin:0 0 12px;">Casa Maddalena · Isola, Syracuse · 15 min d'Ortygie</p>
        <h2 style="color:#0369a1;font-size:15px;margin:16px 0 12px;">📋 Règles</h2>
        <ul style="color:#64748b;font-size:14px;padding-left:20px;margin:0;">
          <li>Check-in à partir de 15h00</li>
          <li>Check-out avant 11h00</li>
          <li>Non-fumeur · Animaux non acceptés</li>
        </ul>
      </div>

      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:20px;">
        Des questions ? Répondez à cet email — nous sommes là pour vous aider.
      </p>
    </div>
    `
  );
}

export async function sendTelegramNotification(booking: BookingEmailData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const message = `🌊 *Nouvelle réservation — Casa Maddalena !*\n\n👤 *${booking.guestName}*\n📧 ${booking.guestEmail}\n${booking.guestPhone ? `📱 ${booking.guestPhone}\n` : ""}\n📅 Arrivée : ${formatDate(booking.checkIn)}\n📅 Départ : ${formatDate(booking.checkOut)}\n🌙 ${booking.nights} nuit(s) · 👥 ${booking.guests} voyageur(s)\n\n💰 *${booking.totalPrice.toFixed(2)} €* — Paiement confirmé ✅`;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
  });
}
