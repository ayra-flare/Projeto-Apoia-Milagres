import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Loader2, TrendingUp, Heart } from "lucide-react";
import ImpactCard from "../components/ImpactCard";
import { Card } from "@/components/ui/card";

export default function Impacto() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["impact", "all"],
    queryFn: () => base44.entities.ImpactPost.list("-created_date", 30),
    initialData: [],
  });

  const totalImpacted = posts.reduce((sum, p) => sum + (p.people_impacted || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <TrendingUp size={24} className="text-primary" />
        Impacto Social
      </h1>

      {/* Banner stats */}
      <Card className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-info/10 border-primary/10">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{posts.length}</p>
            <p className="text-xs text-muted-foreground">Ações realizadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalImpacted.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Pessoas impactadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {[...new Set(posts.map((p) => p.ong_id))].length}
            </p>
            <p className="text-xs text-muted-foreground">ONGs ativas</p>
          </div>
        </div>
      </Card>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhum relato de impacto ainda.</p>
          <p className="text-xs text-muted-foreground mt-1">
            As ONGs compartilharão os resultados de suas ações aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <ImpactCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}