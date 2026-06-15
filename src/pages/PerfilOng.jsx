import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Globe, Phone, CheckCircle, ArrowLeft, ExternalLink } from "lucide-react";
import DemandCard from "../components/DemandCard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PerfilOng() {
  const { id } = useParams();

  const { data: ong, isLoading } = useQuery({
    queryKey: ["ong", id],
    queryFn: () => base44.entities.ONG.filter({ id }, null, 1).then((r) => r[0]),
  });

  const { data: demands } = useQuery({
    queryKey: ["demands", "ong", id],
    queryFn: () => base44.entities.Demand.filter({ ong_id: id, status: "ativa" }, "-created_date", 10),
    initialData: [],
    enabled: !!id,
  });

  const { data: impactPosts } = useQuery({
    queryKey: ["impact", "ong", id],
    queryFn: () => base44.entities.ImpactPost.filter({ ong_id: id }, "-created_date", 10),
    initialData: [],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ong) {
    return (
      <div className="text-center py-20 px-6">
        <h2 className="text-lg font-bold text-foreground mb-2">ONG não encontrada</h2>
        <Link to="/mapa">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft size={14} /> Voltar ao mapa
          </Button>
        </Link>
      </div>
    );
  }

  const totalImpacted = impactPosts.reduce((sum, p) => sum + (p.people_impacted || 0), 0);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-br from-primary/20 to-info/20" />
        <div className="px-4 -mt-12">
          <div className="flex items-end gap-4">
            <img
              src={ong.logo_url || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop"}
              alt={ong.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-lg"
            />
            <div className="pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{ong.name}</h1>
                {ong.verified && <CheckCircle size={18} className="text-info" />}
              </div>
              <p className="text-sm text-muted-foreground">{ong.category?.replace(/_/g, " ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 mt-4 space-y-4">
        <p className="text-sm text-foreground leading-relaxed">{ong.description}</p>

        <div className="flex flex-wrap gap-3">
          {ong.address && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin size={14} /> {ong.address}
            </div>
          )}
          {ong.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone size={14} /> {ong.phone}
            </div>
          )}
          {ong.website && (
            <a
              href={ong.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-info hover:underline"
            >
              <Globe size={14} /> Site
              <ExternalLink size={10} />
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-foreground">{demands.length}</p>
            <p className="text-[10px] text-muted-foreground">Demandas</p>
          </Card>
          <Card className="p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-foreground">{impactPosts.length}</p>
            <p className="text-[10px] text-muted-foreground">Ações</p>
          </Card>
          <Card className="p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-foreground">{totalImpacted}</p>
            <p className="text-[10px] text-muted-foreground">Impactados</p>
          </Card>
        </div>

        {/* Demandas */}
        {demands.length > 0 && (
          <div>
            <h2 className="font-bold text-foreground mb-3">Demandas Ativas</h2>
            <div className="space-y-3">
              {demands.map((demand) => (
                <DemandCard key={demand.id} demand={demand} />
              ))}
            </div>
          </div>
        )}

        {/* Impacto */}
        {impactPosts.length > 0 && (
          <div>
            <h2 className="font-bold text-foreground mb-3">Impacto Gerado</h2>
            <div className="space-y-3">
              {impactPosts.map((post) => (
                <Card key={post.id} className="p-4 rounded-xl">
                  {post.photo_url && (
                    <img src={post.photo_url} alt="Impacto" className="w-full h-48 object-cover rounded-xl mb-3" />
                  )}
                  <p className="text-sm text-foreground">{post.description}</p>
                  {post.people_impacted > 0 && (
                    <Badge className="mt-2 bg-success/10 text-success">
                      {post.people_impacted} pessoas impactadas
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(post.created_date), "d MMM yyyy", { locale: ptBR })}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}