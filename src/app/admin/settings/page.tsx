export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Paramètres</h1>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
        <h2 className="font-semibold text-white">Configuration</h2>
        <p className="text-gray-400 text-sm">
          Les paramètres sensibles (clés Stripe, email, etc.) sont configurés via les variables d&apos;environnement dans votre fichier <code className="bg-gray-800 px-1.5 py-0.5 rounded text-brand-400">.env</code>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[
            { label: "Base de données", status: "PostgreSQL via Prisma", ok: true },
            { label: "Paiements", status: "Stripe Checkout", ok: true },
            { label: "Emails", status: "Nodemailer SMTP", ok: true },
            { label: "Auth admin", status: "NextAuth JWT", ok: true },
            { label: "Webhooks Stripe", status: "/api/webhooks/stripe", ok: true },
            { label: "Notifications Telegram", status: "Optionnel (TELEGRAM_BOT_TOKEN)", ok: false },
          ].map(({ label, status, ok }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${ok ? "bg-green-400" : "bg-yellow-400"}`} />
              <div>
                <p className="text-white font-medium text-sm">{label}</p>
                <p className="text-gray-400 text-xs">{status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="font-semibold text-white mb-3">Variables d&apos;environnement requises</h2>
        <div className="space-y-2 text-xs font-mono">
          {[
            "DATABASE_URL",
            "NEXTAUTH_SECRET",
            "STRIPE_SECRET_KEY",
            "STRIPE_PUBLISHABLE_KEY",
            "STRIPE_WEBHOOK_SECRET",
            "EMAIL_SERVER_HOST",
            "EMAIL_SERVER_USER",
            "EMAIL_SERVER_PASSWORD",
            "OWNER_EMAIL",
          ].map((v) => (
            <div key={v} className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
