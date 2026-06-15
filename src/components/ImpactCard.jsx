import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users } from "lucide-react";

export default function ImpactCard({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="p-4 rounded-xl border-l-[3px] border-l-success hover:shadow-md transition-all duration-200">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-success/10 flex items-center justify-center shrink-0">
            <Heart size={18} className="text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-sm text-foreground">{post.ong_name}</span>
              <Badge className="bg-success/10 text-success border-success/20 text-[10px]">
                Impacto
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(post.created_date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Photo */}
        {post.photo_url && (
          <div className="mt-3 rounded-xl overflow-hidden">
            <img
              src={post.photo_url}
              alt="Impacto"
              className="w-full h-56 object-cover rounded-xl"
            />
          </div>
        )}

        <div className="mt-3 ml-14">
          <p className="text-sm text-foreground leading-relaxed">{post.description}</p>
          {post.people_impacted > 0 && (
            <div className="flex items-center gap-2 mt-3 text-sm text-success font-medium">
              <Users size={16} />
              <span>{post.people_impacted} pessoas impactadas</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}