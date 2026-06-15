import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Package,
  Shirt,
  Utensils,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";

const typeIcons = {
  alimento: Utensils,
  roupa: Shirt,
  recurso: Package,
  voluntario: HeartHandshake,
  outro: Package,
};

export default function DemandCard({ demand, onHelp, alreadyHelped }) {
  const [clicked, setClicked] = useState(false);
  const TypeIcon = typeIcons[demand.type] || Package;

  const handleHelp = async () => {
    if (clicked || alreadyHelped) return;
    setClicked(true);
    try {
      await onHelp?.(demand);
      toast.success("Você se candidatou para ajudar! A ONG será notificada.");
    } catch (err) {
      setClicked(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="bg-[#F47920] border-0 rounded-3xl p-5 text-white hover:shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <TypeIcon size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white">
              {demand.ong_name || "ONG"}
            </span>
          </div>
        </div>

        {/* Content */}
        <h3 className="font-extrabold text-white mb-2 uppercase tracking-wide">
          {demand.title} - {demand.deadline ? format(new Date(demand.deadline), "dd/MM", { locale: ptBR }) : format(new Date(demand.created_date), "dd/MM", { locale: ptBR })}
        </h3>
        <p className="text-white/80 text-sm leading-relaxed mb-3">{demand.description}</p>

        {/* Location & Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/70 text-xs">
            <MapPin size={14} />
            <span>{demand.type?.charAt(0).toUpperCase() + demand.type?.slice(1) || "Doação"}</span>
          </div>
          <Button
            onClick={handleHelp}
            disabled={clicked || alreadyHelped}
            size="sm"
            className={`rounded-full font-bold text-sm gap-1.5 transition-all duration-300 ${
              clicked || alreadyHelped
                ? "bg-white text-green-600"
                : "bg-white text-[#F47920] hover:bg-white/90 active:scale-95"
            }`}
          >
            {clicked || alreadyHelped ? "✓ Candidatado!" : "AJUDAR!"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}