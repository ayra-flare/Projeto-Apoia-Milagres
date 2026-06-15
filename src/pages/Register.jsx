import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Building2, User, Camera, MapPin, Upload } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState("role"); // "role" | "ong_form" | "ong_profile" | "citizen_form" | "otp"
  const [role, setRole] = useState(null);

  // Common
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ONG fields
  const [ongName, setOngName] = useState("");
  const [phone, setPhone] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [about, setAbout] = useState("");

  // Citizen fields
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  // OTP
  const [otpCode, setOtpCode] = useState("");

  const handleOngRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    try {
      const res = await base44.auth.register({ email, password });
      // Create ONG record
      await base44.entities.ONG.create({
        name: ongName,
        phone,
        address,
        description: about,
        logo_url: logoUrl || null,
        website: instagram || facebook || null,
        status: "pending",
        category: "assistencia_social",
      });
      // Set OTP step
      setStep("otp");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleCitizenRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    try {
      const res = await base44.auth.register({ email, password });
      // Save citizen data via updateMe
      const birthDate = birthDay && birthMonth && birthYear
        ? `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`
        : null;
      setStep("otp");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await base44.auth.verifyOtp({ email, otpCode });
      await base44.auth.setToken(res.access_token);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Código inválido.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await base44.auth.resendOtp(email);
      setError("Código reenviado!");
    } catch (err) {
      setError("Erro ao reenviar código.");
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setLogoUrl(file_url);
    } catch (err) {
      setError("Erro ao enviar logo.");
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  const bgStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1531844251246-9a1bfaaeeb9a?w=1200&h=800&fit=crop')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md">
        {/* Role Selection */}
        {step === "role" && (
          <div className="bg-white rounded-3xl p-10 shadow-2xl space-y-6">
            <h1 className="text-3xl font-bold text-[#FF8533] text-center">CADASTRO</h1>
            <p className="text-center text-sm text-gray-500">Escolha seu tipo de conta</p>

            <Button
              onClick={() => { setRole("ong"); setStep("ong_form"); }}
              className="w-full h-14 rounded-full bg-[#FF8533] hover:bg-[#FF8533]/90 text-white font-bold text-lg gap-2"
            >
              <Building2 size={22} />
              ONG
            </Button>

            <Button
              onClick={() => { setRole("citizen"); setStep("citizen_form"); }}
              className="w-full h-14 rounded-full bg-[#FF8533] hover:bg-[#FF8533]/90 text-white font-bold text-lg gap-2"
            >
              <User size={22} />
              APOIADOR
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400">ou</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 rounded-full text-sm font-medium border-gray-300"
              onClick={handleGoogle}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </Button>

            <p className="text-center text-xs text-gray-500">
              Já tem conta?{" "}
              <Link to="/login" className="text-[#FF8533] font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        )}

        {/* OTP Verification */}
        {step === "otp" && (
          <div className="bg-white rounded-3xl p-10 shadow-2xl space-y-5">
            <h1 className="text-2xl font-bold text-[#FF8533] text-center">Verificação</h1>
            <p className="text-center text-sm text-gray-500">
              Enviamos um código para <strong>{email}</strong>
            </p>

            {error && (
              <div className={`p-3 rounded-lg text-sm ${error === "Código reenviado!" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Código de verificação</Label>
                <Input
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="h-12 rounded-full border-gray-300 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-[#FF8533] hover:bg-[#FF8533]/90 text-white font-bold"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verificar"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Não recebeu?{" "}
              <button onClick={handleResendOtp} className="text-[#FF8533] font-semibold hover:underline">
                Reenviar código
              </button>
            </p>
          </div>
        )}

        {/* ONG Registration Step 1 */}
        {step === "ong_form" && (
          <div className="bg-[#FF8026] rounded-3xl p-8 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setStep("role")}
              className="flex items-center gap-2 text-white/80 text-sm font-medium hover:text-white"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-white text-center">Cadastro ONG</h1>

            {error && <div className="p-3 rounded-lg bg-red-500/20 text-white text-sm">{error}</div>}

            <form onSubmit={(e) => { e.preventDefault(); setStep("ong_profile"); }} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Nome da ONG</Label>
                <Input
                  value={ongName}
                  onChange={(e) => setOngName(e.target.value)}
                  className="h-11 rounded-full"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">E-mail</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-full"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Senha</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-full"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Confirme a senha</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-full"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Localização</Label>
                <div className="flex items-center gap-2 bg-white rounded-full px-4 h-11">
                  <MapPin size={16} className="text-gray-400" />
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Endereço da ONG"
                    className="border-0 shadow-none h-full px-0"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Telefone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 rounded-full"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">CNPJ</Label>
                <Input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="h-11 rounded-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-white hover:bg-white/90 text-[#FF8026] font-bold"
              >
                Continuar
              </Button>
            </form>
          </div>
        )}

        {/* ONG Profile Step 2 */}
        {step === "ong_profile" && (
          <div className="bg-[#FF8026] rounded-3xl p-8 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setStep("ong_form")}
              className="flex items-center gap-2 text-white/80 text-sm font-medium hover:text-white"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-white text-center">Perfil da ONG</h1>

            {error && <div className="p-3 rounded-lg bg-red-500/20 text-white text-sm">{error}</div>}

            <form onSubmit={handleOngRegister} className="space-y-4">
              {/* Logo upload */}
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Adicionar sua logo</Label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-dashed border-white/50 hover:bg-white/30 transition">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Camera size={24} className="text-white" />
                      )}
                    </div>
                  </label>
                  <span className="text-white/80 text-sm">Clique para enviar</span>
                </div>
              </div>

              {/* Redes sociais */}
              <div className="space-y-1.5">
                <Label className="text-white text-sm font-bold">REDES:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 h-10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8026" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
                    <Input
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram"
                      className="border-0 shadow-none h-full px-0 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 h-10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <Input
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="Facebook"
                      className="border-0 shadow-none h-full px-0 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 h-10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                    <Input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp"
                      className="border-0 shadow-none h-full px-0 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 h-10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8026" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                    <Input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="E-mail"
                      className="border-0 shadow-none h-full px-0 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sobre */}
              <div className="space-y-1.5">
                <Label className="text-white text-sm font-bold">SOBRE:</Label>
                <Textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Descreva a missão da sua ONG..."
                  className="h-24 rounded-2xl bg-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-white hover:bg-white/90 text-[#FF8026] font-bold"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar conta"}
              </Button>
            </form>
          </div>
        )}

        {/* Citizen Registration */}
        {step === "citizen_form" && (
          <div className="bg-[#FF7F27] rounded-3xl p-8 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setStep("role")}
              className="flex items-center gap-2 text-white/80 text-sm font-medium hover:text-white"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-white text-center">Cadastro Apoiador</h1>

            {error && <div className="p-3 rounded-lg bg-red-500/20 text-white text-sm">{error}</div>}

            <form onSubmit={handleCitizenRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Nome completo</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 rounded-full"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Data de nascimento</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="DD"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="h-11 rounded-full text-center"
                    maxLength={2}
                  />
                  <Input
                    placeholder="MM"
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="h-11 rounded-full text-center"
                    maxLength={2}
                  />
                  <Input
                    placeholder="AAAA"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="h-11 rounded-full text-center"
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">E-mail</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-full"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">CPF</Label>
                <Input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="h-11 rounded-full"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Senha</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-full"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">Confirme a senha</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-full"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-white hover:bg-white/90 text-[#FF7F27] font-bold"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar conta"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}