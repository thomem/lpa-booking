"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Calendar, Settings, LogOut, Home, BarChart3, CalendarOff, Star, Tag, Download } from "lucide-react";

const nav = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/bookings", icon: Calendar, label: "Réservations" },
  { href: "/admin/calendar", icon: CalendarOff, label: "Calendrier" },
  { href: "/admin/pricing", icon: BarChart3, label: "Tarification" },
  { href: "/admin/reviews", icon: Star, label: "Avis clients" },
  { href: "/admin/promo", icon: Tag, label: "Codes promo" },
  { href: "/api/ical", icon: Download, label: "Export iCal" },
  { href: "/admin/settings", icon: Settings, label: "Paramètres" },
];

export function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="w-64 bg-gray-900 flex flex-col min-h-screen border-r border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2 text-white font-bold hover:text-brand-400 transition-colors">
          <Home className="w-5 h-5" />
          Voir le site
        </Link>
        <p className="text-gray-400 text-xs mt-1">Espace propriétaire</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== "/admin" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/20 w-full transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
