import { NextResponse } from "next/server";
import * as nodemailer from "nodemailer";
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

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: `💬 Message de ${name} — ${process.env.NEXT_PUBLIC_PROPERTY_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #e11d48;">Nouveau message via le site</h2>
          <p><strong>De :</strong> ${name} &lt;${email}&gt;</p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 12px;">
            <p style="white-space: pre-wrap; color: #374151;">${message}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
            Répondez directement à cet email pour contacter ${name}.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 });
  }
}
