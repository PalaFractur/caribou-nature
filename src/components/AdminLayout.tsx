import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Mail,
  Settings,
  Menu,
  LogOut,
  Tag,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { pendingCount } = useAdminNotifications();

  const navItems: NavItem[] = [
    { label: "Tableau de bord", to: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Commandes", to: "/admin/commandes", icon: <ShoppingBag size={18} />, badge: pendingCount },
    { label: "Produits", to: "/admin/produits", icon: <Package size={18} /> },
    { label: "Clients", to: "/admin/clients", icon: <Users size={18} /> },
    { label: "Newsletter", to: "/admin/newsletter", icon: <Mail size={18} /> },
    { label: "Codes promo", to: "/admin/codes-promo", icon: <Tag size={18} /> },
    { label: "Paramètres", to: "/admin/parametres", icon: <Settings size={18} /> },
  ];

  function isActive(to: string): boolean {
    if (to === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(to);
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-brun text-creme w-64">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🍃</span>
          <span className="font-display text-xl text-creme">Caribou Nature</span>
        </div>
        <p className="font-body text-xs text-sable ml-9">Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-btn font-body text-sm font-medium transition-colors relative ${
                active
                  ? "bg-ocre text-white"
                  : "text-sable hover:bg-white/10 hover:text-creme"
              }`}
            >
              <span className={active ? "text-white" : "text-sable"}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
                  active ? "bg-white text-ocre" : "bg-ocre text-white"
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-ocre/20 flex items-center justify-center shrink-0">
            <span className="font-body text-xs text-ocre font-bold">A</span>
          </div>
          <div className="min-w-0">
            <p className="font-body text-xs text-creme font-semibold truncate">{user?.email || "admin@caribounature.fr"}</p>
            <p className="font-body text-xs text-sable/70">Administrateur</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-btn font-body text-sm text-sable hover:bg-white/10 hover:text-terracotta transition-colors"
        >
          <LogOut size={16} />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-creme">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 shadow-card z-10">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-blanc-casse border-b border-sable/30 shadow-soft px-6 py-4 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gris-chaud hover:text-brun transition-colors"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-display text-xl text-brun">{title}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-creme p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
