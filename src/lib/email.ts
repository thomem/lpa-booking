import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

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

export async function sendOwnerNotification(booking: BookingEmailData) {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) return;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: ownerEmail,
    subject: `🏠 Nouvelle réservation confirmée — ${booking.guestName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 12px;">
        <h1 style="color: #e11d48; margin-bottom: 24px;">✅ Nouvelle réservation confirmée</h1>

        <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
          <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 16px;">Informations voyageur</h2>
          <p><strong>Nom :</strong> ${booking.guestName}</p>
          <p><strong>Email :</strong> <a href="mailto:${booking.guestEmail}">${booking.guestEmail}</a></p>
          ${booking.guestPhone ? `<p><strong>Téléphone :</strong> ${booking.guestPhone}</p>` : ""}
        </div>

        <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
          <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 16px;">Détails du séjour</h2>
          <p><strong>Arrivée :</strong> ${formatDate(booking.checkIn)}</p>
          <p><strong>Départ :</strong> ${formatDate(booking.checkOut)}</p>
          <p><strong>Durée :</strong> ${booking.nights} nuit(s)</p>
          <p><strong>Voyageurs :</strong> ${booking.guests} personne(s)</p>
        </div>

        <div style="background: #e11d48; border-radius: 8px; padding: 20px; color: white;">
          <h2 style="font-size: 18px; margin-bottom: 8px;">💰 Montant total</h2>
          <p style="font-size: 32px; font-weight: bold; margin: 0;">${booking.totalPrice.toFixed(2)} €</p>
          <p style="opacity: 0.8; margin: 4px 0 0;">Paiement confirmé via Stripe</p>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 16px; text-align: center;">
          ID réservation: ${booking.bookingId}
        </p>
      </div>
    `,
  });
}

export async function sendGuestConfirmation(booking: BookingEmailData) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: booking.guestEmail,
    subject: `✅ Réservation confirmée — ${process.env.NEXT_PUBLIC_PROPERTY_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 12px;">
        <h1 style="color: #e11d48; margin-bottom: 8px;">Votre réservation est confirmée ! 🎉</h1>
        <p style="color: #6b7280;">Bonjour ${booking.guestName}, nous avons bien reçu votre paiement.</p>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 16px;">📅 Votre séjour</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <div style="text-align: center; flex: 1; padding: 12px; background: #fef2f2; border-radius: 8px; margin-right: 8px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">ARRIVÉE</p>
              <p style="color: #1f2937; font-weight: bold; margin: 4px 0;">${formatDate(booking.checkIn)}</p>
              <p style="color: #6b7280; font-size: 12px; margin: 0;">après 15h00</p>
            </div>
            <div style="text-align: center; flex: 1; padding: 12px; background: #fef2f2; border-radius: 8px; margin-left: 8px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">DÉPART</p>
              <p style="color: #1f2937; font-weight: bold; margin: 4px 0;">${formatDate(booking.checkOut)}</p>
              <p style="color: #6b7280; font-size: 12px; margin: 0;">avant 11h00</p>
            </div>
          </div>
          <p style="color: #6b7280;"><strong>Voyageurs :</strong> ${booking.guests} personne(s)</p>
          <p style="color: #6b7280;"><strong>Durée :</strong> ${booking.nights} nuit(s)</p>
        </div>

        <div style="background: #1f2937; border-radius: 8px; padding: 20px; color: white; margin-bottom: 20px;">
          <p style="margin: 0; opacity: 0.7;">Total payé</p>
          <p style="font-size: 28px; font-weight: bold; margin: 4px 0;">${booking.totalPrice.toFixed(2)} €</p>
        </div>

        <div style="background: white; border-radius: 8px; padding: 20px;">
          <h2 style="color: #1f2937; font-size: 16px; margin-bottom: 12px;">📋 Règles du logement</h2>
          <ul style="color: #6b7280; padding-left: 20px;">
            <li>Check-in : à partir de 15h00</li>
            <li>Check-out : avant 11h00</li>
            <li>Non-fumeur</li>
            <li>Animaux non acceptés</li>
          </ul>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 16px; text-align: center;">
          Des questions ? Répondez à cet email ou contactez le propriétaire directement.
        </p>
      </div>
    `,
  });
}

export async function sendTelegramNotification(booking: BookingEmailData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const message = `
🏠 *Nouvelle réservation !*

👤 *Voyageur :* ${booking.guestName}
📧 ${booking.guestEmail}
${booking.guestPhone ? `📱 ${booking.guestPhone}` : ""}

📅 *Arrivée :* ${formatDate(booking.checkIn)}
📅 *Départ :* ${formatDate(booking.checkOut)}
🌙 *Durée :* ${booking.nights} nuit(s)
👥 *Voyageurs :* ${booking.guests}

💰 *Total :* ${booking.totalPrice.toFixed(2)} €
✅ *Statut :* Paiement confirmé
  `.trim();

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
  });
}
