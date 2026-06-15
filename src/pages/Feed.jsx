import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import DemandCard from "../components/DemandCard";

export default function Feed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: demands, isLoading } = useQuery({
    queryKey: ["demands", "feed"],
    queryFn: () => base44.entities.Demand.filter({ status: "ativa" }, "-created_date", 30),
    initialData: [],
  });

  const { data: myDonations } = useQuery({
    queryKey: ["donations", "mine"],
    queryFn: () => base44.entities.Donation.filter({ volunteer_id: user?.id }, "-created_date", 50),
    initialData: [],
    enabled: !!user?.id,
  });

  const donationMutation = useMutation({
    mutationFn: (demand) =>
      base44.entities.Donation.create({
        demand_id: demand.id,
        volunteer_id: user.id,
        volunteer_name: user.full_name || "Voluntário",
        message: "Quero ajudar!",
        status: "pendente",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations", "mine"] });
    },
  });

  const alreadyHelpedIds = new Set(myDonations.map((d) => d.demand_id));

  const handleHelp = async (demand) => {
    await donationMutation.mutateAsync(demand);
  };

  return (
    <div className="pb-20">
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : demands.length === 0 ? (
        <div className="text-center py-20 px-6">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Nenhuma demanda ainda</h2>
          <p className="text-sm text-muted-foreground">
            Quando as ONGs publicarem necessidades, elas aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-4">
          <AnimatePresence>
            {demands.map((demand) => (
              <DemandCard
                key={demand.id}
                demand={demand}
                onHelp={handleHelp}
                alreadyHelped={alreadyHelpedIds.has(demand.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}