import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, X, Shield, Building2, Users, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function Admin() {
  const queryClient = useQueryClient();

  const { data: ongs, isLoading: ongsLoading } = useQuery({
    queryKey: ["ongs", "admin"],
    queryFn: () => base44.entities.ONG.list("-created_date", 50),
    initialData: [],
  });

  const { data: users } = useQuery({
    queryKey: ["users", "admin"],
    queryFn: () => base44.entities.User.list("-created_date", 50),
    initialData: [],
  });

  const { data: reports } = useQuery({
    queryKey: ["reports", "admin"],
    queryFn: () => base44.entities.Report.list("-created_date", 30),
    initialData: [],
  });

  const approveOng = useMutation({
    mutationFn: (ong) => base44.entities.ONG.update(ong.id, { status: "approved", verified: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ongs", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["ongs", "approved"] });
      toast.success("ONG aprovada!");
    },
  });

  const rejectOng = useMutation({
    mutationFn: (ong) => base44.entities.ONG.update(ong.id, { status: "rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ongs", "admin"] });
      toast.success("ONG rejeitada.");
    },
  });

  const updateReport = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Report.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "admin"] });
      toast.success("Denúncia atualizada.");
    },
  });

  const pendingOngs = ongs.filter((o) => o.status === "pending");
  const approvedOngs = ongs.filter((o) => o.status === "approved");
  const pendingReports = reports.filter((r) => r.status === "pendente");

  return (
    <div className="pb-20 px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 rounded-2xl text-center">
          <Building2 size={20} className="mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{approvedOngs.length}</p>
          <p className="text-xs text-muted-foreground">ONGs ativas</p>
        </Card>
        <Card className="p-4 rounded-2xl text-center">
          <Users size={20} className="mx-auto mb-2 text-info" />
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
          <p className="text-xs text-muted-foreground">Usuários</p>
        </Card>
        <Card className="p-4 rounded-2xl text-center">
          <AlertTriangle size={20} className="mx-auto mb-2 text-destructive" />
          <p className="text-2xl font-bold text-foreground">{pendingReports.length}</p>
          <p className="text-xs text-muted-foreground">Denúncias</p>
        </Card>
      </div>

      <Tabs defaultValue="ongs">
        <TabsList className="w-full">
          <TabsTrigger value="ongs" className="flex-1">ONGs Pendentes ({pendingOngs.length})</TabsTrigger>
          <TabsTrigger value="reports" className="flex-1">Ouvidoria ({pendingReports.length})</TabsTrigger>
          <TabsTrigger value="users" className="flex-1">Usuários ({users.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ongs" className="mt-4 space-y-3">
          {ongsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pendingOngs.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">Nenhuma ONG pendente de aprovação.</p>
          ) : (
            pendingOngs.map((ong) => (
              <Card key={ong.id} className="p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <img
                    src={ong.logo_url || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=60&h=60&fit=crop"}
                    alt={ong.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-border"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">{ong.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{ong.description?.slice(0, 100)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Categoria: {ong.category?.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">
                      Criada em {format(new Date(ong.created_date), "d MMM yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1 gap-1 bg-success hover:bg-success/90"
                    onClick={() => approveOng.mutate(ong)}
                    disabled={approveOng.isPending}
                  >
                    <CheckCircle size={14} /> Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 text-destructive border-destructive/30"
                    onClick={() => rejectOng.mutate(ong)}
                    disabled={rejectOng.isPending}
                  >
                    <X size={14} /> Rejeitar
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="reports" className="mt-4 space-y-3">
          {reports.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">Nenhuma denúncia registrada.</p>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="p-4 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-[10px]">{report.category?.replace(/_/g, " ")}</Badge>
                      <Badge className={
                        report.status === "pendente" ? "bg-destructive/10 text-destructive" :
                        report.status === "em_andamento" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                      }>
                        {report.status === "pendente" ? "Pendente" : report.status === "em_andamento" ? "Em andamento" : "Resolvida"}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{report.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(report.created_date), "d MMM yyyy HH:mm", { locale: ptBR })}
                    </p>
                    {report.photo_url && (
                      <img src={report.photo_url} alt="Evidência" className="mt-2 rounded-lg max-h-40 object-cover" />
                    )}
                  </div>
                </div>
                {report.status !== "resolvida" && (
                  <div className="flex gap-2 mt-3">
                    {report.status === "pendente" && (
                      <Button size="sm" className="flex-1" onClick={() => updateReport.mutate({ id: report.id, status: "em_andamento" })}>
                        Iniciar análise
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => updateReport.mutate({ id: report.id, status: "resolvida" })}>
                      Marcar resolvida
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-4 space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">{user.full_name || "Sem nome"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Badge className={
                  user.role === "admin" ? "bg-destructive/10 text-destructive" :
                  user.role === "ong" ? "bg-info/10 text-info" : "bg-primary/10 text-primary"
                }>
                  {user.role === "admin" ? "Admin" : user.role === "ong" ? "ONG" : "Cidadão"}
                </Badge>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}