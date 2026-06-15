import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MapPin, Users, Package, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

function StatBox({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function RightPanel() {
  const { data: ongs } = useQuery({
    queryKey: ["ongs", "approved"],
    queryFn: () => base44.entities.ONG.filter({ status: "approved" }, "-created_date", 10),
    initialData: [],
  });

  const { data: demands } = useQuery({
    queryKey: ["demands", "active"],
    queryFn: () => base44.entities.Demand.filter({ status: "ativa" }, "-created_date", 50),
    initialData: [],
  });

  const { data: impactPosts } = useQuery({
    queryKey: ["impact"],
    queryFn: () => base44.entities.ImpactPost.list("-created_date", 20),
    initialData: [],
  });

  const totalImpacted = impactPosts.reduce((sum, p) => sum + (p.people_impacted || 0), 0);

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatBox icon={MapPin} label="ONGs ativas" value={ongs.length} color="bg-primary" />
        <StatBox icon={Package} label="Demandas" value={demands.length} color="bg-success" />
        <StatBox icon={Users} label="Impactados" value={totalImpacted} color="bg-info" />
        <StatBox icon={TrendingUp} label="Ações" value={impactPosts.length} color="bg-chart-4" />
      </div>

      {/* ONGs em destaque */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">ONGs em Destaque</h3>
        <div className="space-y-3">
          {ongs.slice(0, 5).map((ong) => (
            <Link
              key={ong.id}
              to={`/ong/${ong.id}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <img
                src={ong.logo_url || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=80&h=80&fit=crop"}
                alt={ong.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-border"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{ong.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {ong.category?.replace(/_/g, " ") || "Assistência Social"}
                </p>
              </div>
              {ong.verified && (
                <span className="ml-auto shrink-0 w-5 h-5 rounded-full bg-info flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Mini-Mapa */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="p-4 pb-2 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Mapa da Solidariedade</h3>
          <Link to="/mapa" className="text-xs text-primary font-medium hover:underline">
            Ver mapa
          </Link>
        </div>
        <div className="h-32 bg-secondary m-3 rounded-xl flex items-center justify-center">
          <MapPin size={24} className="text-primary" />
          <span className="text-xs text-muted-foreground ml-2">Milagres, CE</span>
        </div>
      </div>
    </div>
  );
}