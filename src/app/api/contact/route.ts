import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = schema.parse(body);

    const apiKey = process.env.RESEND_API_KEY;
    const ownerEmail = process.env.OWNER_EMAIL;

    if (apiKey && ownerEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Casa Maddalena <onboarding@resend.dev>",
          to: ownerEmail,
          reply_to: email,
          subject: `💬 Message de ${name} — Casa Maddalena`,
          html: `
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0f9ff;padding:32px;border-radius:16px;">
              <h2 style="color:#0284c7;margin:0 0 20px;">💬 Nouveau message via le site</h2>
              <div style="background:white;border-radius:12px;padding:20px;border:1px solid #e0f2fe;">
                <p style="margin:0 0 8px;color:#1e293b;"><strong>${name}</strong> — <a href="mailto:${email}" style="color:#0284c7;">${email}</a></p>
                <hr style="border:none;border-top:1px solid #e0f2fe;margin:12px 0;">
                <p style="white-space:pre-wrap;color:#374151;margin:0;">${message}</p>
              </div>
              <p style="color:#94a3b8;font-size:12px;margin-top:16px;">Répondez directement à cet email pour contacter ${name}.</p>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 });
  }
}
