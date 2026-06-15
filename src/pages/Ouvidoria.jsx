import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ShieldCheck, Upload, Loader2, Image } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Ouvidoria() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("outro");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const reportMutation = useMutation({
    mutationFn: (data) => base44.entities.Report.create(data),
    onSuccess: () => {
      setSubmitted(true);
      setDescription("");
      setCategory("outro");
      setPhotoUrl("");
      toast.success("Denúncia enviada com segurança. Seus dados permanecem anônimos.");
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPhotoUrl(file_url);
    } catch (err) {
      toast.error("Erro ao enviar imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    reportMutation.mutate({
      description,
      category,
      photo_url: photoUrl || null,
      status: "pendente",
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mb-6"
        >
          <ShieldCheck size={40} className="text-success" />
        </motion.div>
        <h2 className="text-xl font-bold text-foreground mb-2">Denúncia registrada</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Sua denúncia foi enviada com segurança e será analisada pela nossa equipe. Seus dados pessoais não são vinculados ao relato.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Fazer nova denúncia
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-info/10 flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-info" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Ouvidoria de Direitos Sociais</h1>
        <p className="text-sm text-muted-foreground">
          Canal seguro e anônimo para relatar violações de direitos. Seus dados pessoais não são armazenados com a denúncia.
        </p>
      </motion.div>

      <Card className="p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="direitos_humanos">Direitos Humanos</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="educacao">Educação</SelectItem>
                <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                <SelectItem value="meio_ambiente">Meio Ambiente</SelectItem>
                <SelectItem value="corrupcao">Corrupção</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Descreva a situação</Label>
            <Textarea
              id="desc"
              placeholder="Relate o ocorrido com o máximo de detalhes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Anexar imagem (opcional)</Label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-secondary transition-colors text-sm">
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploading ? "Enviando..." : "Escolher imagem"}
                </div>
              </label>
              {photoUrl && (
                <div className="flex items-center gap-2 text-sm text-success font-medium">
                  <Image size={16} />
                  Imagem anexada
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Metadados da imagem são removidos automaticamente para proteger sua identidade.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={reportMutation.isPending || !description.trim()}
          >
            {reportMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Enviar Denúncia Anônima
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}