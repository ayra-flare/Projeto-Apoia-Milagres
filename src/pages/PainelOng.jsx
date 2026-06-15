import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Users, TrendingUp, CheckCircle, X, FileText, Plus } from "lucide-react";
import DemandForm from "../components/DemandForm";
import { AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PainelOng() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: myOng } = useQuery({
    queryKey: ["ong", "mine"],
    queryFn: async () => {
      const ongs = await base44.entities.ONG.filter({ created_by_id: user?.id });
      return ongs[0] || null;
    },
    enabled: !!user?.id,
  });

  const { data: demands, isLoading: demandsLoading } = useQuery({
    queryKey: ["demands", "ong"],
    queryFn: () => base44.entities.Demand.filter({ ong_id: myOng?.id }, "-created_date", 30),
    initialData: [],
    enabled: !!myOng?.id,
  });

  const { data: donations } = useQuery({
    queryKey: ["donations", "ong"],
    queryFn: async () => {
      if (!myOng?.id) return [];
      const allDemands = await base44.entities.Demand.filter({ ong_id: myOng.id });
      const demandIds = allDemands.map((d) => d.id);
      if (demandIds.length === 0) return [];
      // Get donations for each demand
      const results = [];
      for (const did of demandIds) {
        const don = await base44.entities.Donation.filter({ demand_id: did });
        results.push(...don);
      }
      return results;
    },
    initialData: [],
    enabled: !!myOng?.id,
  });

  const { data: impactPosts, isLoading: impactLoading } = useQuery({
    queryKey: ["impact", "ong"],
    queryFn: () => base44.entities.ImpactPost.filter({ ong_id: myOng?.id }, "-created_date", 20),
    initialData: [],
    enabled: !!myOng?.id,
  });

  const createDemand = useMutation({
    mutationFn: (data) => base44.entities.Demand.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demands", "ong"] });
      queryClient.invalidateQueries({ queryKey: ["demands", "feed"] });
      setShowForm(false);
    },
  });

  const updateDonation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Donation.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["donations", "ong"] }),
  });

  const concludeDemand = useMutation({
    mutationFn: (demand) => base44.entities.Demand.update(demand.id, { status: "atendida" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demands", "ong"] });
      queryClient.invalidateQueries({ queryKey: ["demands", "feed"] });
    },
  });

  if (!myOng && !demandsLoading) {
    return (
      <div className="text-center py-20 px-6">
        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
          <Package size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">Nenhuma ONG vinculada</h2>
        <p className="text-sm text-muted-foreground">
          Sua conta ainda não está vinculada a uma ONG. Entre em contato com um administrador.
        </p>
      </div>
    );
  }

  const activeDemands = demands.filter((d) => d.status === "ativa");
  const attendedDemands = demands.filter((d) => d.status === "atendida");
  const totalImpacted = impactPosts.reduce((sum, p) => sum + (p.people_impacted || 0), 0);

  return (
    <div className="pb-20 px-4 py-6 space-y-6">
      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 rounded-2xl bg-primary/5 border-primary/10">
          <Package size={20} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{activeDemands.length}</p>
          <p className="text-xs text-muted-foreground">Demandas ativas</p>
        </Card>
        <Card className="p-4 rounded-2xl bg-success/5 border-success/10">
          <CheckCircle size={20} className="text-success mb-2" />
          <p className="text-2xl font-bold text-foreground">{attendedDemands.length}</p>
          <p className="text-xs text-muted-foreground">Atendidas</p>
        </Card>
        <Card className="p-4 rounded-2xl bg-info/5 border-info/10">
          <Users size={20} className="text-info mb-2" />
          <p className="text-2xl font-bold text-foreground">{donations.length}</p>
          <p className="text-xs text-muted-foreground">Voluntários</p>
        </Card>
        <Card className="p-4 rounded-2xl bg-chart-4/10 border-chart-4/10">
          <TrendingUp size={20} className="text-chart-4 mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalImpacted}</p>
          <p className="text-xs text-muted-foreground">Impactados</p>
        </Card>
      </div>

      {/* Nova Demanda */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Minhas Demandas</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Plus size={16} />
          Nova Demanda
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <DemandForm
            ongId={myOng?.id}
            ongName={myOng?.name}
            onSubmit={(data) => createDemand.mutate(data)}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Demandas */}
      <div className="space-y-3">
        {demands.map((demand) => (
          <Card key={demand.id} className="p-4 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground text-sm">{demand.title}</h3>
                  <Badge className={
                    demand.status === "ativa" ? "bg-primary/10 text-primary" :
                    demand.status === "atendida" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }>
                    {demand.status === "ativa" ? "Ativa" : demand.status === "atendida" ? "Atendida" : "Encerrada"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(demand.created_date), "d MMM yyyy", { locale: ptBR })}
                  {demand.deadline && ` · Até ${format(new Date(demand.deadline), "d/M", { locale: ptBR })}`}
                </p>
              </div>
              {demand.status === "ativa" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => concludeDemand.mutate(demand)}
                  className="text-success border-success/30 hover:bg-success/10"
                >
                  <CheckCircle size={14} className="mr-1" />
                  Concluir
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Voluntários */}
      <h2 className="text-lg font-bold text-foreground pt-4">Voluntários Candidatos</h2>
      <div className="space-y-3">
        {donations.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum voluntário se candidatou ainda.</p>
        ) : (
          donations.map((donation) => (
            <Card key={donation.id} className="p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">{donation.volunteer_name || "Voluntário"}</p>
                  {donation.message && (
                    <p className="text-xs text-muted-foreground mt-0.5">{donation.message}</p>
                  )}
                  <Badge className="mt-1.5 text-[10px]">
                    {donation.status === "pendente" ? "Pendente" : donation.status === "confirmada" ? "Confirmada" : donation.status}
                  </Badge>
                </div>
                {donation.status === "pendente" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-success border-success/30 hover:bg-success/10"
                      onClick={() => updateDonation.mutate({ id: donation.id, status: "confirmada" })}
                    >
                      <CheckCircle size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => updateDonation.mutate({ id: donation.id, status: "cancelada" })}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Relatório */}
      <Card className="p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 text-center">
        <FileText size={24} className="mx-auto mb-2 text-primary" />
        <h3 className="font-bold text-foreground mb-1">Relatório de Impacto</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Gere um PDF com os dados de impacto da sua ONG para apresentação oficial.
        </p>
        <Button className="gap-2" onClick={async () => {
          const { default: jsPDF } = await import("jspdf");
          const doc = new jsPDF();
          doc.setFontSize(18);
          doc.text(`Relatório de Impacto - ${myOng?.name || "ONG"}`, 20, 30);
          doc.setFontSize(12);
          doc.text(`Demandas ativas: ${activeDemands.length}`, 20, 50);
          doc.text(`Demandas atendidas: ${attendedDemands.length}`, 20, 60);
          doc.text(`Voluntários: ${donations.length}`, 20, 70);
          doc.text(`Pessoas impactadas: ${totalImpacted}`, 20, 80);
          doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 20, 100);
          doc.save(`relatorio-impacto-${myOng?.name || "ONG"}.pdf`);
        }}>
          <FileText size={16} />
          Gerar Relatório PDF
        </Button>
      </Card>
    </div>
  );
}