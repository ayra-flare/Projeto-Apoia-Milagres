import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import {
  Home,
  MapPin,
  Shield,
  BarChart3,
  Heart,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Feed", icon: Home, roles: ["citizen", "ong", "admin"] },
  { path: "/mapa", label: "Mapa da Solidariedade", icon: MapPin, roles: ["citizen", "ong", "admin"] },
  { path: "/impacto", label: "Impacto", icon: Heart, roles: ["citizen", "ong", "admin"] },
  { path: "/ouvidoria", label: "Ouvidoria", icon: Shield, roles: ["citizen", "ong", "admin"] },
  { path: "/painel", label: "Painel da ONG", icon: BarChart3, roles: ["ong"] },
  { path: "/admin", label: "Administração", icon: Shield, roles: ["admin"] },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || "citizen";

  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = "/login";
  };

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 bg-card border-r border-border flex flex-col transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-3 border-b border-border bg-[#E0E0E0]">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://media.base44.com/images/public/user_6a2ef4ab093947d604173176/bacfb50e3_ApoiaMilagresLogo.png"
              alt="Apoia Milagres"
              className="h-8 w-8 rounded-lg"
            />
            <span className="font-bold text-sm text-[#F47920] tracking-wide">
              APOIA MILAGRES
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className={`ml-auto p-2 rounded-lg hover:bg-white/50 text-[#F47920] transition-colors ${
            collapsed ? "mx-auto" : ""
          }`}
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User area */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}